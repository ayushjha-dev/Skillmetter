'use client';

import { motion } from 'framer-motion';
import { UserInsight } from '@/types';
import { Lightbulb } from 'lucide-react';

interface InsightsListProps {
  username: string;
  insights: UserInsight[];
  color: 'secondary' | 'accent';
}

export default function InsightsList({ username, insights, color }: InsightsListProps) {
  const colorClass = color === 'secondary' ? 'text-cyber-secondary border-cyber-secondary' : 'text-cyber-accent border-cyber-accent';
  const bgClass = color === 'secondary' ? 'bg-cyber-secondary/10' : 'bg-cyber-accent/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="cyber-card p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className={`w-5 h-5 ${colorClass}`} />
        <h3 className={`font-cyber text-sm ${colorClass}`}>
          {username.toUpperCase()}'S INSIGHTS
        </h3>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                insight.type === 'strength' 
                  ? 'bg-cyber-primary/10 border border-cyber-primary/20' 
                  : insight.type === 'weakness'
                  ? 'bg-cyber-danger/10 border border-cyber-danger/20'
                  : 'bg-cyber-card border border-cyber-border'
              }`}
            >
              <span className="text-lg">{insight.icon}</span>
              <span className={`text-sm font-mono ${
                insight.type === 'strength' 
                  ? 'text-cyber-primary' 
                  : insight.type === 'weakness'
                  ? 'text-cyber-danger'
                  : 'text-gray-400'
              }`}>
                {insight.message}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-sm font-mono text-center py-4">
            No specific insights available
          </p>
        )}
      </div>

      {/* Insight Types Legend */}
      <div className="mt-4 pt-4 border-t border-cyber-border">
        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyber-primary" />
            <span>Strength</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyber-danger" />
            <span>Weakness</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span>Neutral</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
