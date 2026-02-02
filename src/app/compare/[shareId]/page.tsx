'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ComparisonResults from '@/components/ComparisonResults';
import LoadingScreen from '@/components/LoadingScreen';
import Footer from '@/components/Footer';
import { ComparisonData } from '@/types';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function SharedComparison() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from a database using the shareId
    // For now, we'll show an error since we don't persist comparisons
    const timer = setTimeout(() => {
      setIsLoading(false);
      setError('This shared comparison has expired or does not exist. Start a new battle!');
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.shareId]);

  const handleReset = () => {
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen relative z-10">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="cyber-card p-8">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="font-cyber text-xl text-cyber-warning mb-4">
                LINK EXPIRED
              </h2>
              <p className="text-gray-400 font-mono text-sm mb-6">
                {error}
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-btn flex items-center gap-2 mx-auto"
                >
                  <Home className="w-4 h-4" />
                  START NEW BATTLE
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : comparisonData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ComparisonResults data={comparisonData} onReset={handleReset} />
          </motion.div>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
