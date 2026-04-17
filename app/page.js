'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, Minus, AlertTriangle, Search, 
  Clock, Zap, BarChart3, History, Trophy, Brain, Activity,
  ChevronRight, RefreshCw, Target, Shield, AlertCircle
} from 'lucide-react';

export default function ConsensusAI() {
  const [ticker, setTicker] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('analyze');
  const [error, setError] = useState(null);

  // Fetch history and leaderboard on mount
  useEffect(() => {
    fetchHistory();
    fetchLeaderboard();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history?limit=10');
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const analyzeStock = async () => {
    if (!ticker.trim()) return;
    
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: ticker.trim(), context: context.trim() || null })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Analysis failed');
      }
      
      const data = await res.json();
      setAnalysis(data);
      fetchHistory();
      fetchLeaderboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (score) => {
    if (score > 0.2) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (score < -0.2) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  const getSentimentColor = (score) => {
    if (score > 0.2) return 'text-green-500';
    if (score < -0.2) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getSentimentBg = (score) => {
    if (score > 0.2) return 'bg-green-500/10 border-green-500/30';
    if (score < -0.2) return 'bg-red-500/10 border-red-500/30';
    return 'bg-yellow-500/10 border-yellow-500/30';
  };

  const formatScore = (score) => {
    const percentage = ((score + 1) / 2 * 100).toFixed(0);
    return `${score > 0 ? '+' : ''}${(score * 100).toFixed(0)}%`;
  };

  const ConsensusGauge = ({ score, divergence, alert }) => {
    const normalizedScore = ((score + 1) / 2) * 100;
    
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Bearish</span>
          <span className="text-sm font-medium text-muted-foreground">Bullish</span>
        </div>
        <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 h-full w-1 bg-white shadow-lg transform -translate-x-1/2 transition-all duration-500"
            style={{ left: `${normalizedScore}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>-100%</span>
          <span>0%</span>
          <span>+100%</span>
        </div>
        {alert && (
          <div className="mt-3 flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">High Divergence Alert - Models Conflicted</span>
          </div>
        )}
      </div>
    );
  };

  const ModelCard = ({ response, index }) => {
    if (!response) return null;
    
    return (
      <Card className={`border-2 ${getSentimentBg(response.sentiment_score)} transition-all hover:shadow-lg`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" style={{ color: response.model_color }} />
              <CardTitle className="text-lg">{response.model_name}</CardTitle>
            </div>
            <Badge variant={response.success ? 'default' : 'destructive'}>
              {response.success ? 'Success' : 'Failed'}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {response.latency_ms}ms latency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sentiment Score */}
          <div className="text-center py-4 rounded-lg bg-background/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getSentimentIcon(response.sentiment_score)}
              <span className={`text-3xl font-bold ${getSentimentColor(response.sentiment_score)}`}>
                {formatScore(response.sentiment_score)}
              </span>
            </div>
            <Badge variant="outline" className="capitalize">
              {response.sentiment_label}
            </Badge>
            <div className="mt-2 text-sm text-muted-foreground">
              Confidence: {(response.confidence * 100).toFixed(0)}%
            </div>
          </div>
          
          {/* Reasoning */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <Target className="h-4 w-4" /> Analysis
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {response.reasoning}
            </p>
          </div>
          
          {/* Key Risks */}
          {response.key_risks?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <Shield className="h-4 w-4" /> Key Risks
              </h4>
              <ul className="space-y-1">
                {response.key_risks.map((risk, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-1 text-amber-500 flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  ConsensusAI
                </h1>
                <p className="text-sm text-muted-foreground">Multi-Model Market Auditor</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-yellow-500" />
              Powered by Groq LPU
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Analyze
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" /> History
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Audit Stock Sentiment
                </CardTitle>
                <CardDescription>
                  Enter a ticker symbol to query 3 AI models simultaneously and find consensus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter ticker symbol (e.g., NVDA, AAPL, TSLA)"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && analyzeStock()}
                      className="text-lg font-mono"
                    />
                  </div>
                  <Button 
                    onClick={analyzeStock} 
                    disabled={loading || !ticker.trim()}
                    className="px-6"
                  >
                    {loading ? (
                      <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Zap className="h-4 w-4 mr-2" /> Analyze</>
                    )}
                  </Button>
                </div>
                <Input
                  placeholder="Optional: Add context (e.g., 'Focus on AI chip demand')"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="text-sm"
                />
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <Brain className="h-16 w-16 text-primary animate-pulse" />
                        <Activity className="h-6 w-6 text-green-500 absolute -top-1 -right-1 animate-bounce" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Running Multi-Model Analysis</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Querying Llama 3, Mixtral & Gemma in parallel...
                      </p>
                    </div>
                    <div className="max-w-xs mx-auto space-y-2">
                      <Progress value={33} className="h-2" />
                      <Progress value={66} className="h-2" />
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {analysis && !loading && (
              <div className="space-y-6">
                {/* Consensus Summary */}
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          <span className="font-mono bg-primary/10 px-3 py-1 rounded">${analysis.ticker}</span>
                          Consensus Report
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {new Date(analysis.timestamp).toLocaleString()} • {analysis.total_latency_ms}ms total
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold ${getSentimentColor(analysis.consensus_score)}`}>
                          {formatScore(analysis.consensus_score)}
                        </div>
                        <Badge variant="outline" className="capitalize text-lg mt-1">
                          {analysis.consensus_verdict}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Consensus Gauge */}
                    <ConsensusGauge 
                      score={analysis.consensus_score} 
                      divergence={analysis.divergence_score}
                      alert={analysis.divergence_alert}
                    />
                    
                    <Separator />
                    
                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold">{analysis.models_successful}/{analysis.models_total}</div>
                        <div className="text-xs text-muted-foreground">Models Successful</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold">{(analysis.divergence_score * 100).toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground">Divergence Score</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold">{analysis.headlines?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Headlines Analyzed</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold">{analysis.total_latency_ms}ms</div>
                        <div className="text-xs text-muted-foreground">Total Latency</div>
                      </div>
                    </div>

                    {/* Headlines */}
                    {analysis.headlines?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3">News Headlines Analyzed</h4>
                        <ul className="space-y-2">
                          {analysis.headlines.map((headline, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              {headline}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Aggregated Risks */}
                    {analysis.aggregated_risks?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Aggregated Risk Factors
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.aggregated_risks.map((risk, i) => (
                            <Badge key={i} variant="outline" className="bg-amber-500/10 border-amber-500/30">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* War Room - 3 Model Columns */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    AI War Room - Individual Model Analyses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.model_responses?.map((response, index) => (
                      <ModelCard key={response.model_key} response={response} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Analysis History
                </CardTitle>
                <CardDescription>
                  Previous stock analyses stored in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No analyses yet. Start by analyzing a stock ticker!
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {history.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => {
                            setAnalysis(item);
                            setActiveTab('analyze');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg">${item.ticker}</span>
                              {getSentimentIcon(item.consensus_score)}
                              <span className={`font-semibold ${getSentimentColor(item.consensus_score)}`}>
                                {formatScore(item.consensus_score)}
                              </span>
                              <Badge variant="outline" className="capitalize">
                                {item.consensus_verdict}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {item.divergence_alert && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Divergence
                                </Badge>
                              )}
                              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Model Performance Leaderboard
                </CardTitle>
                <CardDescription>
                  Track which AI model is historically most accurate in predicting market direction
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No leaderboard data yet. Analyses will populate this over time.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((model, index) => (
                      <div key={model.model_name} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          #{index + 1}
                        </div>
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${model.model_color}20` }}>
                          <Brain className="h-6 w-6" style={{ color: model.model_color }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{model.model_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {model.total_analyses || 0} analyses performed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {model.accuracy_score ? `${(model.accuracy_score * 100).toFixed(1)}%` : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {model.correct_predictions || 0}/{model.total_predictions || 0} correct
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              ConsensusAI - Multi-Model Market Auditor
            </div>
            <div>
              Open Source • Powered by Groq LPU • Llama 3.1 • Llama 3.3 • Qwen3
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
