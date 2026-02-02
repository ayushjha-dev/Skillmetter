'use client';

import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Share2, Download } from 'lucide-react';
import { ComparisonData } from '@/types';
import ProfileCard from './ProfileCard';
import VerdictBanner from './VerdictBanner';
import MetricComparison from './MetricComparison';
import DomainChart from './DomainChart';
import InsightsList from './InsightsList';
import ScoreBreakdown from './ScoreBreakdown';

interface ComparisonResultsProps {
  data: ComparisonData;
  onReset: () => void;
}

export default function ComparisonResults({ data, onReset }: ComparisonResultsProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/compare/${data.shareId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Skillmetter Comparison Results',
          text: `${data.user1.username} vs ${data.user2.username} - Check out this skill comparison!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12">
      {/* Verdict Banner */}
      <VerdictBanner verdict={data.verdict} user1={data.user1} user2={data.user2} />
      
      {/* Profile Cards */}
      <section className="grid md:grid-cols-2 gap-8">
        <ProfileCard 
          profile={data.user1} 
          scores={data.user1Scores}
          title={data.verdict.user1Title}
          isWinner={data.verdict.winner === 'user1'}
          position="left"
        />
        <ProfileCard 
          profile={data.user2} 
          scores={data.user2Scores}
          title={data.verdict.user2Title}
          isWinner={data.verdict.winner === 'user2'}
          position="right"
        />
      </section>

      {/* Score Breakdown */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-cyber text-xl text-cyber-primary mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            SCORE BREAKDOWN
          </h2>
          <ScoreBreakdown 
            user1={data.user1}
            user2={data.user2}
            scores1={data.user1Scores}
            scores2={data.user2Scores}
          />
        </motion.div>
      </section>

      {/* Metric Comparisons */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-cyber text-xl text-cyber-primary mb-6">
            ⚔️ HEAD-TO-HEAD COMPARISON
          </h2>
          <MetricComparison 
            comparisons={data.metricComparisons}
            user1={data.user1.username}
            user2={data.user2.username}
          />
        </motion.div>
      </section>

      {/* Domain Analysis Charts */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-cyber text-xl text-cyber-primary mb-6">
            🎯 CYBER DOMAIN INTELLIGENCE
          </h2>
          <DomainChart 
            user1={data.user1}
            user2={data.user2}
          />
        </motion.div>
      </section>

      {/* Insights */}
      <section className="grid md:grid-cols-2 gap-8">
        <InsightsList 
          username={data.user1.username}
          insights={data.user1Insights}
          color="secondary"
        />
        <InsightsList 
          username={data.user2.username}
          insights={data.user2Insights}
          color="accent"
        />
      </section>

      {/* Action Buttons */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4 pt-8"
      >
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cyber-btn flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          NEW BATTLE
        </motion.button>
        
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cyber-btn flex items-center gap-2"
          style={{ borderColor: 'rgba(0, 212, 255, 0.5)', color: '#00d4ff' }}
        >
          <Share2 className="w-4 h-4" />
          SHARE RESULTS
        </motion.button>
      </motion.section>

      {/* Comparison ID */}
      <div className="text-center text-gray-600 text-xs font-mono">
        Battle ID: {data.shareId} • Compared at {new Date(data.comparedAt).toLocaleString()}
      </div>
    </div>
  );
}
