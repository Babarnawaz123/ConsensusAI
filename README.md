# ConsensusAI - Multi-Model Market Auditor

<div align="center">

![ConsensusAI Logo](https://img.shields.io/badge/ConsensusAI-Multi--Model%20Market%20Auditor-8B5CF6?style=for-the-badge&logo=brain&logoColor=white)

**An open-source framework for auditing the financial reasoning of Large Language Models**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq-LPU-FF6B6B?style=flat-square)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://divergence-gauge.preview.emergentagent.com) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**ConsensusAI** is an innovative open-source framework designed to audit the financial reasoning of Large Language Models (LLMs). Unlike traditional single-model AI tools, ConsensusAI queries **three different AI architectures simultaneously** to find consensus on market sentiment.

### The Problem We Solve

| Problem | Our Solution |
|---------|--------------|
| Single point of failure in AI predictions | Multi-model parallel inference |
| AI hallucinations and bias | Cross-examination of multiple "experts" |
| Lack of transparency in AI reasoning | Divergence detection and detailed analysis |
| No accountability in AI financial tools | Performance leaderboard tracking accuracy |

### How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User      │────▶│  News Headlines  │────▶│  3 AI Models    │
│   Input     │     │  (RSS/API)       │     │  (Parallel)     │
│   $NVDA     │     └──────────────────┘     └─────────────────┘
└─────────────┘                                      │
                                                     ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Dashboard  │◀────│  Consensus       │◀────│  Divergence     │
│  Results    │     │  Algorithm       │     │  Calculation    │
└─────────────┘     └──────────────────┘     └─────────────────┘
```

---

## ✨ Features

### Core Features

- **🧠 Multi-Model Analysis** - Query Llama 3.1, Llama 3.3 70B, and Qwen3 32B simultaneously
- **⚡ Lightning Fast** - Sub-3-second inference powered by Groq LPU
- **📊 Consensus Algorithm** - Calculate agreement/disagreement between AI models
- **🎯 Divergence Detection** - Alert when models significantly disagree (>50%)
- **📈 Interactive Charts** - Visualize sentiment comparison and performance metrics
- **🏆 Performance Leaderboard** - Track which model is historically most accurate

### Additional Features

- **🌓 Dark/Light Mode** - Beautiful theme toggle with system preference support
- **📥 Export Options** - Download analysis as JSON, CSV, or copy to clipboard
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🔔 Toast Notifications** - Real-time feedback on actions
- **⚙️ Settings Page** - Manage API keys and preferences
- **📜 Analysis History** - Browse and review past analyses

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB |
| **AI/LLM** | Groq API (Llama 3.1, Llama 3.3, Qwen3) |
| **Theming** | next-themes |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| **Node.js** | v18.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** or **yarn** | Latest | Comes with Node.js |
| **MongoDB** | v6.0+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Groq API Key** | - | [console.groq.com](https://console.groq.com/keys) |

### Getting a Groq API Key (Free)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your key (starts with `gsk_`)

---

## 🚀 Quick Start

### Option 1: Clone and Run (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/consensusai.git
cd consensusai

# 2. Install dependencies
npm install
# or
yarn install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Edit .env.local with your credentials
nano .env.local

# 5. Start MongoDB (if running locally)
mongod --dbpath /data/db

# 6. Run the development server
npm run dev
# or
yarn dev

# 7. Open http://localhost:3000 in your browser
```

### Option 2: Create from Scratch

```bash
# 1. Create Next.js project
npx create-next-app@latest consensusai --tailwind --eslint --app --src-dir=no --import-alias="@/*"
cd consensusai

# 2. Install dependencies
npm install groq-sdk next-themes recharts react-is lucide-react mongodb uuid
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs 
npm install @radix-ui/react-switch @radix-ui/react-separator @radix-ui/react-scroll-area
npm install @radix-ui/react-progress @radix-ui/react-alert-dialog @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge sonner

# 3. Initialize shadcn/ui
npx shadcn@latest init

# 4. Add shadcn components
npx shadcn@latest add button card input badge tabs scroll-area progress 
npx shadcn@latest add separator alert dropdown-menu sheet switch label textarea toast

# 5. Copy the source files from this repository

# 6. Set up environment variables and run
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# ===========================================
# DATABASE CONFIGURATION
# ===========================================

# MongoDB Connection String
# Local: mongodb://localhost:27017
# Atlas: mongodb+srv://username:password@cluster.mongodb.net
MONGO_URL=mongodb://localhost:27017

# Database Name
DB_NAME=consensusai

# ===========================================
# AI/LLM CONFIGURATION
# ===========================================

# Groq API Key (Required)
# Get yours free at: https://console.groq.com/keys
GROQ_API_KEY=gsk_your_api_key_here

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CORS Origins (comma-separated for multiple)
CORS_ORIGINS=*
```

### Environment Variables Explained

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | Name of the database |
| `GROQ_API_KEY` | Yes | Your Groq API key for LLM inference |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL (defaults to localhost:3000) |
| `CORS_ORIGINS` | No | Allowed CORS origins |

---

## 📁 Project Structure

```
consensusai/
├── app/                              # Next.js App Router
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js              # All API endpoints
│   ├── about/
│   │   └── page.js                   # About page
│   ├── contact/
│   │   └── page.js                   # Contact page
│   ├── settings/
│   │   └── page.js                   # Settings page
│   ├── globals.css                   # Global styles & animations
│   ├── layout.js                     # Root layout with providers
│   └── page.js                       # Home page (Analysis)
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── tabs.jsx
│   │   └── ...
│   ├── Footer.js                     # Footer component
│   ├── Navbar.js                     # Navigation bar
│   └── ThemeProvider.js              # Dark mode provider
│
├── lib/
│   └── utils.js                      # Utility functions (cn)
│
├── public/                           # Static assets
│
├── .env.local                        # Environment variables
├── .env.example                      # Example env file
├── components.json                   # shadcn configuration
├── jsconfig.json                     # JS config with aliases
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.js                 # PostCSS config
├── tailwind.config.js                # Tailwind configuration
└── README.md                         # This file
```

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production:  https://your-domain.com/api
```

### Endpoints

#### 1. Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. Analyze Stock (Main Endpoint)

```http
POST /api/analyze
```

**Request Body:**
```json
{
  "ticker": "NVDA",
  "context": "Focus on AI chip demand"  // optional
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "ticker": "NVDA",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "headlines": [
    "NVIDIA reports record Q4 earnings...",
    "AI chip demand continues to surge..."
  ],
  "model_responses": [
    {
      "model_key": "llama",
      "model_name": "Llama 3.1 8B",
      "model_color": "#3B82F6",
      "sentiment_score": 0.75,
      "sentiment_label": "bullish",
      "key_risks": ["Market volatility", "Competition"],
      "reasoning": "Strong earnings and AI demand...",
      "confidence": 0.85,
      "latency_ms": 450,
      "success": true
    },
    // ... 2 more models
  ],
  "consensus_score": 0.72,
  "consensus_verdict": "bullish",
  "divergence_score": 0.15,
  "divergence_alert": false,
  "aggregated_risks": ["Market volatility", "Competition", "Regulation"],
  "total_latency_ms": 1200,
  "models_successful": 3,
  "models_total": 3
}
```

---

#### 3. Get Analysis History

```http
GET /api/history?limit=10&ticker=NVDA
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Max results to return |
| `ticker` | string | - | Filter by ticker symbol |

**Response:**
```json
{
  "history": [
    { /* analysis object */ },
    { /* analysis object */ }
  ]
}
```

---

#### 4. Get Leaderboard

```http
GET /api/leaderboard
```

**Response:**
```json
{
  "leaderboard": [
    {
      "model_name": "Llama 3.3 70B",
      "model_key": "llama70b",
      "model_color": "#8B5CF6",
      "total_analyses": 150,
      "total_predictions": 50,
      "correct_predictions": 38,
      "accuracy_score": 0.76
    }
  ]
}
```

---

#### 5. Record Market Outcome

```http
POST /api/record-outcome
```

**Request Body:**
```json
{
  "analysis_id": "uuid-here",
  "actual_direction": "up"  // "up" or "down"
}
```

**Response:**
```json
{
  "success": true
}
```

---

#### 6. Get Available Models

```http
GET /api/models
```

**Response:**
```json
{
  "models": {
    "llama": {
      "id": "llama-3.1-8b-instant",
      "name": "Llama 3.1 8B",
      "color": "#3B82F6"
    },
    "llama70b": {
      "id": "llama-3.3-70b-versatile",
      "name": "Llama 3.3 70B",
      "color": "#8B5CF6"
    },
    "qwen": {
      "id": "qwen/qwen3-32b",
      "name": "Qwen3 32B",
      "color": "#10B981"
    }
  }
}
```

---

## 📖 Usage Guide

### Analyzing a Stock

1. **Enter Ticker Symbol**
   - Type the stock ticker (e.g., `NVDA`, `AAPL`, `TSLA`)
   - Optionally add context for focused analysis

2. **Click Analyze**
   - System fetches latest news headlines
   - Queries 3 AI models in parallel
   - Calculates consensus and divergence

3. **Review Results**
   - **Consensus Score**: Average sentiment (-100% to +100%)
   - **Divergence Score**: How much models disagree
   - **Charts**: Visual comparison of model outputs
   - **War Room**: Individual model analyses

### Understanding the Metrics

| Metric | Range | Meaning |
|--------|-------|---------|
| **Sentiment Score** | -100% to +100% | Bearish to Bullish |
| **Divergence Score** | 0% to 100% | Model agreement (lower = more agreement) |
| **Confidence** | 0% to 100% | Model's confidence in its prediction |
| **Latency** | ms | Response time for each model |

### Divergence Alert

When divergence exceeds **50%**, a yellow alert appears indicating:
- Models are significantly disagreeing
- Exercise caution with the analysis
- Review individual model reasoning

### Export Options

- **Copy Summary**: Plain text for sharing
- **Export JSON**: Full data for analysis
- **Export CSV**: Spreadsheet format for comparison

---

## ⚙️ Configuration

### Tailwind Configuration

The project uses custom Tailwind configuration in `tailwind.config.js`:

```javascript
// Key customizations:
- Custom color palette with CSS variables
- Extended animations (slide-up, scale-in, pulse-glow)
- Custom container width
- Dark mode support via class
```

### Adding New AI Models

Edit `app/api/[[...path]]/route.js`:

```javascript
const MODELS = {
  llama: { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', color: '#3B82F6' },
  llama70b: { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', color: '#8B5CF6' },
  qwen: { id: 'qwen/qwen3-32b', name: 'Qwen3 32B', color: '#10B981' },
  // Add new model here:
  // newmodel: { id: 'model-id', name: 'Display Name', color: '#HEX' },
};
```

### Customizing News Sources

The system currently fetches from Yahoo Finance RSS. To add sources, edit the `fetchNewsHeadlines` function in the API route.

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed

```
Error: MongoNetworkError: connect ECONNREFUSED
```

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
# or
mongod --dbpath /data/db
```

#### Groq API Error

```
Error: 401 Unauthorized
```

**Solution:**
1. Verify your API key at [console.groq.com](https://console.groq.com)
2. Ensure the key is correctly set in `.env.local`
3. Restart the development server

#### Module Not Found

```
Error: Cannot find module 'xyz'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port Already in Use

```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Getting Help

1. Check the [Issues](https://github.com/yourusername/consensusai/issues) page
2. Search existing issues before creating new ones
3. Provide detailed error messages and steps to reproduce

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/consensusai.git
cd consensusai

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push and create a Pull Request
git push origin feature/amazing-feature
```

### Contribution Guidelines

1. **Code Style**: Follow the existing code style
2. **Testing**: Test your changes thoroughly
3. **Documentation**: Update README if needed
4. **Commits**: Use clear, descriptive commit messages

### Ideas for Contributions

- [ ] Add more AI models (Claude, GPT-4, etc.)
- [ ] Implement hallucination detection
- [ ] Add more news sources
- [ ] Create mobile app
- [ ] Add email notifications
- [ ] Implement user authentication

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 ConsensusAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) - For lightning-fast LLM inference
- [shadcn/ui](https://ui.shadcn.com/) - For beautiful UI components
- [Next.js](https://nextjs.org/) - For the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - For utility-first styling
- [Recharts](https://recharts.org/) - For responsive charts

---

<div align="center">

**Made with ❤️ by the ConsensusAI Team**

[⬆ Back to Top](#consensusai---multi-model-market-auditor)

</div>
