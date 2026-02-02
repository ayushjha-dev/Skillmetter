'use client';

import { motion } from 'framer-motion';
import { UserProfile, ComputedScores, DEFAULT_SCORING_WEIGHTS } from '@/types';

interface ScoreBreakdownProps {
  user1: UserProfile;
  user2: UserProfile;
  scores1: ComputedScores;
  scores2: ComputedScores;
}

const SCORE_LABELS = [
  { key: 'rankScore', label: 'Rank Score', icon: '🏆' },
  { key: 'roomsScore', label: 'Rooms Score', icon: '🚀' },
  { key: 'diversityScore', label: 'Diversity Score', icon: '🌐' },
  { key: 'badgesScore', label: 'Badges & Certs', icon: '🎖️' },
  { key: 'streakScore', label: 'Streak Score', icon: '🔥' },
  { key: 'eventsScore', label: 'Events & Paths', icon: '📅' },
  { key: 'activityScore', label: 'Activity Score', icon: '⚡' },
];

export default function ScoreBreakdown({ user1, user2, scores1, scores2 }: ScoreBreakdownProps) {
  const weights = DEFAULT_SCORING_WEIGHTS;
  const weightValues = Object.values(weights);

  return (
    <div className="cyber-card p-6">
      {/* Header */}
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 mb-6 text-center">
        <div className="font-cyber text-cyber-secondary text-sm">
          {user1.username}
        </div>
        <div className="font-cyber text-gray-400 text-xs">
          SCORE CATEGORY
        </div>
        <div className="font-cyber text-cyber-accent text-sm">
          {user2.username}
        </div>
      </div>

      {/* Score Rows */}
      <div className="space-y-4">
        {SCORE_LABELS.map((scoreItem, index) => {
          const score1 = scores1[scoreItem.key as keyof ComputedScores];
          const score2 = scores2[scoreItem.key as keyof ComputedScores];
          const weight = weightValues[index] || 0;
          const weighted1 = score1 * weight;
          const weighted2 = score2 * weight;
          const winner = weighted1 > weighted2 ? 'user1' : weighted2 > weighted1 ? 'user2' : 'tie';

          return (
            <motion.div
              key={scoreItem.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center"
            >
              {/* User 1 Score */}
              <div className={`text-right ${winner === 'user1' ? 'text-cyber-primary' : 'text-gray-400'}`}>
                <span className="font-mono text-lg">{score1.toFixed(1)}</span>
                <span className="text-xs text-gray-600 ml-1">({weighted1.toFixed(1)})</span>
              </div>

              {/* Category Label */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span>{scoreItem.icon}</span>
                  <span className="text-gray-300 text-sm font-mono">{scoreItem.label}</span>
                </div>
                <div className="mt-1 h-1 bg-cyber-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyber-secondary via-cyber-primary to-cyber-accent"
                    style={{ width: `${weight * 100 * 5}%` }}
                  />
                </div>
                <span className="text-gray-600 text-xs font-mono">
                  {(weight * 100).toFixed(0)}% weight
                </span>
              </div>

              {/* User 2 Score */}
              <div className={`text-left ${winner === 'user2' ? 'text-cyber-primary' : 'text-gray-400'}`}>
                <span className="font-mono text-lg">{score2.toFixed(1)}</span>
                <span className="text-xs text-gray-600 ml-1">({weighted2.toFixed(1)})</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Score Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-cyber-border"
      >
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center">
          <div className="text-right">
            <span className={`font-cyber text-2xl ${
              scores1.totalScore > scores2.totalScore ? 'text-cyber-primary glow-text-subtle' : 'text-gray-400'
            }`}>
              {scores1.totalScore.toFixed(1)}
            </span>
          </div>
          <div className="text-center">
            <span className="font-cyber text-lg text-white">TOTAL SCORE</span>
          </div>
          <div className="text-left">
            <span className={`font-cyber text-2xl ${
              scores2.totalScore > scores1.totalScore ? 'text-cyber-primary glow-text-subtle' : 'text-gray-400'
            }`}>
              {scores2.totalScore.toFixed(1)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Scoring Formula Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 rounded-lg bg-cyber-dark/50 border border-cyber-border"
      >
        <p className="text-xs font-mono text-gray-500 text-center">
          📊 Total Score = Σ(Category Score × Weight) | Max possible: 100 points
        </p>
      </motion.div>
    </div>
  );
}
