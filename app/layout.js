import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ConsensusAI - Multi-Model Market Auditor',
  description: 'Audit the financial reasoning of Large Language Models. Cross-examine multiple AI experts simultaneously to find consensus on market sentiment.',
  keywords: 'AI, stock analysis, sentiment analysis, LLM, Groq, market analysis, consensus',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
