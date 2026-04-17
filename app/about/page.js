'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Brain, Zap, Shield, GitBranch, Users, Target, 
  CheckCircle, ArrowRight, Sparkles, BarChart3,
  Clock, Lock, Globe, Code
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Model Analysis',
    description: 'Query 3 different AI architectures simultaneously for comprehensive market sentiment analysis.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Powered by Groq LPU for sub-3-second inference across all models.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  {
    icon: Target,
    title: 'Divergence Detection',
    description: 'Automatically detect when AI models disagree, alerting you to uncertainty.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  {
    icon: Shield,
    title: 'Hallucination Audit',
    description: 'Cross-reference AI claims against ground truth data to flag potential hallucinations.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: BarChart3,
    title: 'Performance Tracking',
    description: 'Self-correcting leaderboard tracks which model is historically most accurate.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'Fully open-source framework that researchers and developers can extend.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
];

const models = [
  { name: 'Llama 3.1 8B', provider: 'Meta', params: '8B', color: '#3B82F6' },
  { name: 'Llama 3.3 70B', provider: 'Meta', params: '70B', color: '#8B5CF6' },
  { name: 'Qwen3 32B', provider: 'Alibaba', params: '32B', color: '#10B981' },
];

const stats = [
  { value: '3', label: 'AI Models', icon: Brain },
  { value: '<3s', label: 'Latency', icon: Clock },
  { value: '100%', label: 'Open Source', icon: Lock },
  { value: 'Global', label: 'Coverage', icon: Globe },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center stagger-children">
            <Badge variant="outline" className="mb-4 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-2" />
              Open Source AI Framework
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">ConsensusAI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              An open-source framework designed to audit the financial reasoning of Large Language Models, 
              moving beyond simple market prediction to focus on AI Accountability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <Button size="lg" className="group">
                  Start Analyzing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/settings">
                <Button size="lg" variant="outline">
                  Configure API
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">The Problem</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ConsensusAI Exists</h2>
            </div>
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Single Point of Failure</h3>
                    <p className="text-sm text-muted-foreground">
                      Standard AI tools rely on a single model, creating unreliable predictions.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Hallucinations & Bias</h3>
                    <p className="text-sm text-muted-foreground">
                      Models are prone to inventing facts and exhibiting inherent biases.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Lack of Cross-Examination</h3>
                    <p className="text-sm text-muted-foreground">
                      No tools exist to cross-examine multiple AI "experts" simultaneously.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ConsensusAI provides a comprehensive toolkit for auditing AI financial reasoning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="hover-lift group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">AI Models</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The AI Panel of Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three diverse AI architectures provide balanced, multi-perspective analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {models.map((model, index) => (
              <Card 
                key={model.name} 
                className="hover-lift hover-glow text-center animate-slide-up"
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  borderColor: `${model.color}30`
                }}
              >
                <CardHeader>
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${model.color}15` }}
                  >
                    <Brain className="h-8 w-8" style={{ color: model.color }} />
                  </div>
                  <CardTitle>{model.name}</CardTitle>
                  <CardDescription>{model.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{model.params} Parameters</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Audit Your AI?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start analyzing stocks with multi-model consensus today. It's free and open source.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <Button size="lg" className="group animate-pulse-glow">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
