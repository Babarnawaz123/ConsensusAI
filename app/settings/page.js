'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Settings, Key, Brain, Zap, Shield, Save, 
  RefreshCw, CheckCircle, AlertCircle, Eye, EyeOff,
  ExternalLink, Info, Trash2, Database, Bell,
  Palette, Globe, Code
} from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [apiStatus, setApiStatus] = useState(null); // 'valid', 'invalid', null
  const [models, setModels] = useState([]);
  
  const [preferences, setPreferences] = useState({
    autoSave: true,
    notifications: true,
    darkMode: false,
    debugMode: false,
  });

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
    
    // Load preferences
    const savedPrefs = localStorage.getItem('consensusai_preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
    
    // Fetch current models
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      setModels(Object.values(data.models || {}));
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    setIsValidating(true);
    setApiStatus(null);
    
    try {
      // Test the API key by making a simple request
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      if (res.ok) {
        setApiStatus('valid');
        toast.success('API key is valid!');
      } else {
        setApiStatus('invalid');
        toast.error('API key is invalid');
      }
    } catch (error) {
      setApiStatus('invalid');
      toast.error('Failed to validate API key');
    } finally {
      setIsValidating(false);
    }
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem('groq_api_key', apiKey);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('API key saved successfully!');
    }, 500);
  };

  const clearApiKey = () => {
    setApiKey('');
    setApiStatus(null);
    localStorage.removeItem('groq_api_key');
    toast.success('API key cleared');
  };

  const savePreferences = () => {
    localStorage.setItem('consensusai_preferences', JSON.stringify(preferences));
    toast.success('Preferences saved!');
  };

  const togglePreference = (key) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: !prev[key] };
      if (preferences.autoSave) {
        localStorage.setItem('consensusai_preferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Settings className="h-3 w-3 mr-2" />
              Configuration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Settings</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Configure your API keys and customize your ConsensusAI experience.
            </p>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="api" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Key className="h-4 w-4" /> API Keys
                </TabsTrigger>
                <TabsTrigger value="models" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" /> Models
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Preferences
                </TabsTrigger>
              </TabsList>

              {/* API Keys Tab */}
              <TabsContent value="api" className="space-y-6 animate-slide-up">
                <Card className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          Groq API Key
                        </CardTitle>
                        <CardDescription>
                          Enter your Groq API key to enable multi-model analysis.
                        </CardDescription>
                      </div>
                      {apiStatus && (
                        <Badge variant={apiStatus === 'valid' ? 'default' : 'destructive'}>
                          {apiStatus === 'valid' ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Valid</>
                          ) : (
                            <><AlertCircle className="h-3 w-3 mr-1" /> Invalid</>
                          )}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="apiKey"
                            type={showApiKey ? 'text' : 'password'}
                            placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="pr-10 font-mono text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={validateApiKey} variant="outline" disabled={isValidating}>
                        {isValidating ? (
                          <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Validating...</>
                        ) : (
                          <><Shield className="h-4 w-4 mr-2" /> Validate</>
                        )}
                      </Button>
                      <Button onClick={saveApiKey} disabled={isSaving}>
                        {isSaving ? (
                          <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                        ) : (
                          <><Save className="h-4 w-4 mr-2" /> Save Key</>
                        )}
                      </Button>
                      <Button onClick={clearApiKey} variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>How to get your Groq API Key</AlertTitle>
                      <AlertDescription>
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                          <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">console.groq.com <ExternalLink className="h-3 w-3" /></a></li>
                          <li>Sign up or log in to your account</li>
                          <li>Navigate to API Keys section</li>
                          <li>Create a new API key and copy it here</li>
                        </ol>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Security Note */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Security Note</h4>
                        <p className="text-sm text-muted-foreground">
                          Your API key is stored locally in your browser and is never sent to our servers. 
                          All API calls are made directly from your browser to Groq.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Models Tab */}
              <TabsContent value="models" className="space-y-6 animate-slide-up">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Active AI Models
                    </CardTitle>
                    <CardDescription>
                      These models are queried in parallel for every analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {models.map((model, index) => (
                        <div 
                          key={model.name} 
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors animate-slide-in-right"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${model.color}15` }}
                            >
                              <Brain className="h-5 w-5" style={{ color: model.color }} />
                            </div>
                            <div>
                              <h4 className="font-medium">{model.name}</h4>
                              <p className="text-sm text-muted-foreground font-mono">{model.id}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Model Selection</AlertTitle>
                  <AlertDescription>
                    Model selection is currently fixed to ensure diverse AI perspectives. 
                    Custom model selection will be available in a future update.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6 animate-slide-up">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>General Preferences</CardTitle>
                    <CardDescription>
                      Customize your ConsensusAI experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      {
                        id: 'autoSave',
                        icon: Save,
                        title: 'Auto-save Preferences',
                        description: 'Automatically save changes to preferences',
                      },
                      {
                        id: 'notifications',
                        icon: Bell,
                        title: 'Analysis Notifications',
                        description: 'Show notifications when analysis completes',
                      },
                      {
                        id: 'debugMode',
                        icon: Code,
                        title: 'Debug Mode',
                        description: 'Show detailed logs and raw API responses',
                      },
                    ].map((pref, index) => {
                      const Icon = pref.icon;
                      return (
                        <div 
                          key={pref.id} 
                          className="flex items-center justify-between animate-slide-in-right"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-muted">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                                {pref.title}
                              </Label>
                              <p className="text-sm text-muted-foreground">{pref.description}</p>
                            </div>
                          </div>
                          <Switch
                            id={pref.id}
                            checked={preferences[pref.id]}
                            onCheckedChange={() => togglePreference(pref.id)}
                          />
                        </div>
                      );
                    })}

                    <Separator />

                    <div className="flex justify-end">
                      <Button onClick={savePreferences}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Management
                    </CardTitle>
                    <CardDescription>
                      Manage your locally stored data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          localStorage.clear();
                          toast.success('All local data cleared');
                          window.location.reload();
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Local Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
