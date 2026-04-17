import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ConsensusAI - Multi-Model Market Auditor',
  description: 'Audit the financial reasoning of Large Language Models. Cross-examine multiple AI experts simultaneously to find consensus on market sentiment.',
  keywords: 'AI, stock analysis, sentiment analysis, LLM, Groq, market analysis, consensus, financial AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
