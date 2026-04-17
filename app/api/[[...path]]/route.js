import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'consensusai';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

// Initialize Groq client lazily
let groqClient = null;
function getGroqClient() {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

// Model configurations - Using currently available Groq models (2025-2026)
const MODELS = {
  llama: { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', color: '#3B82F6' },
  llama70b: { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', color: '#8B5CF6' },
  qwen: { id: 'qwen/qwen3-32b', name: 'Qwen3 32B', color: '#10B981' }
};

// Financial news RSS feeds
const NEWS_SOURCES = [
  'https://feeds.finance.yahoo.com/rss/2.0/headline?s={ticker}&region=US&lang=en-US',
  'https://news.google.com/rss/search?q={ticker}+stock&hl=en-US&gl=US&ceid=US:en'
];

// Fetch news headlines for a ticker
async function fetchNewsHeadlines(ticker) {
  try {
    // Use a simple fetch to get news - we'll parse RSS manually
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'ConsensusAI/1.0' },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      // Fallback to mock headlines if RSS fails
      return generateMockHeadlines(ticker);
    }
    
    const xml = await response.text();
    const headlines = parseRSSHeadlines(xml);
    
    if (headlines.length === 0) {
      return generateMockHeadlines(ticker);
    }
    
    return headlines.slice(0, 5);
  } catch (error) {
    console.error('News fetch error:', error);
    return generateMockHeadlines(ticker);
  }
}

// Parse RSS XML to extract headlines
function parseRSSHeadlines(xml) {
  const headlines = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[([^\]]+)\]\]><\/title>|<title>([^<]+)<\/title>/;
  
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const titleMatch = titleRegex.exec(item);
    if (titleMatch) {
      const title = (titleMatch[1] || titleMatch[2] || '').trim();
      if (title && title.length > 10) {
        headlines.push(title);
      }
    }
  }
  return headlines;
}

// Generate mock headlines for testing
function generateMockHeadlines(ticker) {
  return [
    `${ticker} reports strong Q2 earnings, beating analyst expectations`,
    `Market analysts upgrade ${ticker} to 'Buy' rating amid growth prospects`,
    `${ticker} announces new product launch, stock shows mixed reaction`,
    `Tech sector volatility impacts ${ticker} trading volume`,
    `${ticker} CEO discusses expansion plans in investor call`
  ];
}

// Query a single model with structured output
async function queryModel(modelKey, ticker, headlines, context) {
  const model = MODELS[modelKey];
  const startTime = Date.now();
  
  const systemPrompt = `You are a financial analyst expert. Analyze news headlines and provide structured market sentiment analysis.
You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no extra text).
The JSON must have exactly these fields:
- sentiment_score: a number from -1.0 (very bearish) to 1.0 (very bullish)
- sentiment_label: one of "bullish", "bearish", or "neutral"
- key_risks: an array of 2-3 string risk factors
- reasoning: a string explaining your analysis in 2-3 sentences
- confidence: a number from 0.0 to 1.0 indicating your confidence level`;

  const userPrompt = `Analyze the following news headlines for ${ticker} stock and provide your market sentiment analysis:

Headlines:
${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

${context ? `Additional Context: ${context}` : ''}

Respond with ONLY the JSON object, nothing else.`;

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: model.id,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const latency = Date.now() - startTime;
    
    // Parse JSON from response
    let parsed;
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      parsed = {
        sentiment_score: 0,
        sentiment_label: 'neutral',
        key_risks: ['Unable to parse response'],
        reasoning: responseText.slice(0, 200),
        confidence: 0.3
      };
    }

    return {
      model_key: modelKey,
      model_name: model.name,
      model_color: model.color,
      sentiment_score: Math.max(-1, Math.min(1, Number(parsed.sentiment_score) || 0)),
      sentiment_label: parsed.sentiment_label || 'neutral',
      key_risks: Array.isArray(parsed.key_risks) ? parsed.key_risks.slice(0, 3) : [],
      reasoning: parsed.reasoning || 'No reasoning provided',
      confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5)),
      latency_ms: latency,
      raw_response: responseText,
      success: true
    };
  } catch (error) {
    console.error(`Model ${model.name} error:`, error);
    return {
      model_key: modelKey,
      model_name: model.name,
      model_color: model.color,
      sentiment_score: 0,
      sentiment_label: 'neutral',
      key_risks: ['Model inference failed'],
      reasoning: `Error: ${error.message}`,
      confidence: 0,
      latency_ms: Date.now() - startTime,
      raw_response: error.message,
      success: false
    };
  }
}

// Calculate divergence score (standard deviation)
function calculateDivergence(scores) {
  if (scores.length === 0) return 0;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const squaredDiffs = scores.map(s => Math.pow(s - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
  return Math.sqrt(variance);
}

// Determine consensus verdict
function getConsensusVerdict(scores) {
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avgScore > 0.3) return 'bullish';
  if (avgScore < -0.3) return 'bearish';
  return 'neutral';
}

// API Routes Handler
async function handleRequest(request, path, method) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Health check
  if (path === '/api/health') {
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() }, { headers: corsHeaders });
  }

  // Models info
  if (path === '/api/models') {
    return NextResponse.json({ models: MODELS }, { headers: corsHeaders });
  }

  // Analyze ticker - Main consensus engine
  if (path === '/api/analyze' && method === 'POST') {
    try {
      const body = await request.json();
      const { ticker, context } = body;
      
      if (!ticker) {
        return NextResponse.json({ error: 'Ticker symbol required' }, { status: 400, headers: corsHeaders });
      }

      const tickerUpper = ticker.toUpperCase().trim();
      
      // Fetch news headlines
      const headlines = await fetchNewsHeadlines(tickerUpper);
      
      // Run all 3 models in parallel
      const startTime = Date.now();
      const modelPromises = Object.keys(MODELS).map(key => 
        queryModel(key, tickerUpper, headlines, context)
      );
      
      const modelResults = await Promise.all(modelPromises);
      const totalLatency = Date.now() - startTime;
      
      // Calculate consensus metrics
      const successfulResults = modelResults.filter(r => r.success);
      const scores = successfulResults.map(r => r.sentiment_score);
      const divergenceScore = calculateDivergence(scores);
      const consensusScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const consensusVerdict = getConsensusVerdict(scores);
      const divergenceAlert = divergenceScore > 0.5;
      
      // Aggregate all key risks
      const allRisks = successfulResults.flatMap(r => r.key_risks);
      const uniqueRisks = [...new Set(allRisks)].slice(0, 5);
      
      // Store analysis in database
      const { db } = await connectToDatabase();
      const analysisId = uuidv4();
      
      const analysis = {
        id: analysisId,
        ticker: tickerUpper,
        timestamp: new Date(),
        headlines,
        context: context || null,
        model_responses: modelResults,
        consensus_score: consensusScore,
        consensus_verdict: consensusVerdict,
        divergence_score: divergenceScore,
        divergence_alert: divergenceAlert,
        aggregated_risks: uniqueRisks,
        total_latency_ms: totalLatency,
        models_successful: successfulResults.length,
        models_total: modelResults.length
      };
      
      await db.collection('analyses').insertOne(analysis);
      
      // Update model performance stats
      for (const result of modelResults) {
        await db.collection('leaderboard').updateOne(
          { model_name: result.model_name },
          {
            $inc: { total_analyses: 1 },
            $set: { 
              model_key: result.model_key,
              model_color: result.model_color,
              last_analysis: new Date()
            }
          },
          { upsert: true }
        );
      }
      
      return NextResponse.json(analysis, { headers: corsHeaders });
    } catch (error) {
      console.error('Analysis error:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
  }

  // Get analysis history
  if (path === '/api/history' && method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const ticker = url.searchParams.get('ticker');
      
      const query = ticker ? { ticker: ticker.toUpperCase() } : {};
      const history = await db.collection('analyses')
        .find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      return NextResponse.json({ history }, { headers: corsHeaders });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
  }

  // Get leaderboard
  if (path === '/api/leaderboard' && method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const leaderboard = await db.collection('leaderboard')
        .find({})
        .sort({ accuracy_score: -1 })
        .toArray();
      
      return NextResponse.json({ leaderboard }, { headers: corsHeaders });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
  }

  // Record actual market outcome (for leaderboard accuracy tracking)
  if (path === '/api/record-outcome' && method === 'POST') {
    try {
      const body = await request.json();
      const { analysis_id, actual_direction } = body; // 'up' or 'down'
      
      if (!analysis_id || !actual_direction) {
        return NextResponse.json({ error: 'analysis_id and actual_direction required' }, { status: 400, headers: corsHeaders });
      }
      
      const { db } = await connectToDatabase();
      const analysis = await db.collection('analyses').findOne({ id: analysis_id });
      
      if (!analysis) {
        return NextResponse.json({ error: 'Analysis not found' }, { status: 404, headers: corsHeaders });
      }
      
      // Determine which models were correct
      const actualScore = actual_direction === 'up' ? 1 : -1;
      
      for (const modelResponse of analysis.model_responses) {
        const predicted = modelResponse.sentiment_score > 0 ? 'up' : modelResponse.sentiment_score < 0 ? 'down' : 'neutral';
        const isCorrect = (actual_direction === 'up' && modelResponse.sentiment_score > 0) ||
                         (actual_direction === 'down' && modelResponse.sentiment_score < 0);
        
        await db.collection('leaderboard').updateOne(
          { model_name: modelResponse.model_name },
          {
            $inc: { 
              total_predictions: 1,
              correct_predictions: isCorrect ? 1 : 0
            }
          },
          { upsert: true }
        );
      }
      
      // Update analysis with outcome
      await db.collection('analyses').updateOne(
        { id: analysis_id },
        { $set: { actual_outcome: actual_direction, outcome_recorded: new Date() } }
      );
      
      // Recalculate accuracy scores
      const leaders = await db.collection('leaderboard').find({}).toArray();
      for (const leader of leaders) {
        if (leader.total_predictions > 0) {
          const accuracy = (leader.correct_predictions || 0) / leader.total_predictions;
          await db.collection('leaderboard').updateOne(
            { model_name: leader.model_name },
            { $set: { accuracy_score: accuracy } }
          );
        }
      }
      
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
  }

  // Get single analysis
  if (path.startsWith('/api/analysis/') && method === 'GET') {
    try {
      const analysisId = path.replace('/api/analysis/', '');
      const { db } = await connectToDatabase();
      const analysis = await db.collection('analyses').findOne({ id: analysisId });
      
      if (!analysis) {
        return NextResponse.json({ error: 'Analysis not found' }, { status: 404, headers: corsHeaders });
      }
      
      return NextResponse.json(analysis, { headers: corsHeaders });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function GET(request, { params }) {
  const path = '/api/' + (params.path?.join('/') || '');
  return handleRequest(request, path, 'GET');
}

export async function POST(request, { params }) {
  const path = '/api/' + (params.path?.join('/') || '');
  return handleRequest(request, path, 'POST');
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
