'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Brain, Menu, Home, Info, Mail, Settings, Zap, 
  BarChart3, X, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Analyze', icon: BarChart3 },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-lg border-b' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-all duration-300">
                <Brain className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">
                <span className="text-foreground">Consensus</span>
                <span className="gradient-text">AI</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-1">Multi-Model Market Auditor</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`relative group px-4 ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-primary/5'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-2 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-primary' : ''
                    }`} />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Powered by Badge */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Powered by <span className="font-semibold text-foreground">Groq LPU</span></span>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">
                      <span>Consensus</span>
                      <span className="gradient-text">AI</span>
                    </h2>
                    <p className="text-xs text-muted-foreground">Multi-Model Market Auditor</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div 
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            isActive 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Powered by <span className="font-semibold text-foreground">Groq LPU</span></span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
