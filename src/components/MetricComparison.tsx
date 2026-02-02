'use client';

import { motion } from 'framer-motion';
import { MetricComparison as MetricComparisonType } from '@/types';
import { Check, X, Minus } from 'lucide-react';

interface MetricComparisonProps {
  comparisons: MetricComparisonType[];
  user1: string;
  user2: string;
}

export default function MetricComparison({ comparisons, user1, user2 }: MetricComparisonProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 text-xs font-mono text-gray-500 px-4">
        <div className="text-right">{user1}</div>
        <div className="text-center">Metric</div>
        <div className="text-left">{user2}</div>
      </div>

      {/* Comparison Bars */}
      {comparisons.map((comparison, index) => (
        <motion.div
          key={comparison.metric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="cyber-card p-4"
        >
          {/* Label and Weight */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 font-mono text-sm">
              {comparison.label}
            </span>
            <span className="text-gray-600 text-xs font-mono">
              Weight: {(comparison.weight * 100).toFixed(0)}%
            </span>
          </div>

          {/* Comparison Bar */}
          <div className="relative">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
              {/* User 1 Bar */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-cyber-secondary font-mono text-sm min-w-[50px] text-right">
                  {formatValue(comparison.user1Value, comparison.metric)}
                </span>
                <div className="flex-1 max-w-[200px]">
                  <div className="h-6 bg-cyber-dark rounded-l-md overflow-hidden flex justify-end">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${comparison.user1Percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      className="h-full bg-gradient-to-l from-cyber-secondary to-cyber-secondary/50 rounded-l-md"
                    />
                  </div>
                </div>
              </div>

              {/* Winner Indicator */}
              <div className="w-8 h-8 flex items-center justify-center">
                {comparison.winner === 'user1' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                    className="w-6 h-6 rounded-full bg-cyber-secondary/20 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-cyber-secondary" />
                  </motion.div>
                )}
                {comparison.winner === 'user2' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                    className="w-6 h-6 rounded-full bg-cyber-accent/20 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-cyber-accent" />
                  </motion.div>
                )}
                {comparison.winner === 'tie' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                    className="w-6 h-6 rounded-full bg-gray-600/20 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 text-gray-500" />
                  </motion.div>
                )}
              </div>

              {/* User 2 Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 max-w-[200px]">
                  <div className="h-6 bg-cyber-dark rounded-r-md overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${comparison.user2Percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-cyber-accent/50 to-cyber-accent rounded-r-md"
                    />
                  </div>
                </div>
                <span className="text-cyber-accent font-mono text-sm min-w-[50px]">
                  {formatValue(comparison.user2Value, comparison.metric)}
                </span>
              </div>
            </div>

            {/* Score percentages */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mt-1">
              <div className="text-right text-xs font-mono text-gray-600">
                {comparison.user1Percentage.toFixed(1)} pts
              </div>
              <div className="w-8" />
              <div className="text-left text-xs font-mono text-gray-600">
                {comparison.user2Percentage.toFixed(1)} pts
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="flex justify-center gap-6 pt-4 text-xs font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-secondary" />
          <span>{user1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-accent" />
          <span>{user2}</span>
        </div>
      </div>
    </div>
  );
}

function formatValue(value: number, metric: string): string {
  if (metric === 'rank') {
    return `#${value.toLocaleString()}`;
  }
  if (metric === 'diversity' || metric === 'activity') {
    return `${value.toFixed(0)}%`;
  }
  return value.toLocaleString();
}
