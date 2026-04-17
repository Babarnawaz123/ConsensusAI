'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Brain, Menu, Home, Info, Mail, Settings, Zap, 
  BarChart3, X, ChevronRight, Moon, Sun, Monitor
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
              <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                <Brain className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">
                <span className="text-foreground">Consensus</span>
                <span className="text-primary">AI</span>
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

          {/* Right side - Theme toggle and Powered by */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5" />
                    ) : theme === 'light' ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Monitor className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">
                        <span>Consensus</span>
                        <span className="text-primary">AI</span>
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

                  {/* Theme toggle in mobile */}
                  <div className="py-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Theme</p>
                    <div className="flex gap-2">
                      <Button 
                        variant={theme === 'light' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTheme('light')}
                        className="flex-1"
                      >
                        <Sun className="h-4 w-4 mr-2" /> Light
                      </Button>
                      <Button 
                        variant={theme === 'dark' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTheme('dark')}
                        className="flex-1"
                      >
                        <Moon className="h-4 w-4 mr-2" /> Dark
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Powered by <span className="font-semibold text-foreground">Groq LPU</span></span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
