'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown, Swords, Star } from 'lucide-react';
import { Verdict, UserProfile } from '@/types';

interface VerdictBannerProps {
  verdict: Verdict;
  user1: UserProfile;
  user2: UserProfile;
}

export default function VerdictBanner({ verdict, user1, user2 }: VerdictBannerProps) {
  const isTie = verdict.winner === 'tie';
  const winner = verdict.winner === 'user1' ? user1 : user2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className={`relative overflow-hidden rounded-2xl p-8 ${
        isTie 
          ? 'bg-gradient-to-r from-cyber-secondary/20 via-cyber-accent/20 to-cyber-secondary/20 border-2 border-cyber-accent/50'
          : 'bg-gradient-to-r from-cyber-primary/20 via-cyber-primary/10 to-cyber-primary/20 border-2 border-cyber-primary/50 winner-card'
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyber-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-cyber-secondary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-flex items-center gap-2 mb-4"
          >
            {isTie ? (
              <Swords className="w-8 h-8 text-cyber-accent" />
            ) : (
              <Trophy className="w-8 h-8 text-cyber-primary trophy-animate" />
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-cyber text-3xl md:text-4xl mb-2"
          >
            {isTie ? (
              <span className="text-cyber-accent glow-text">IT&apos;S A TIE!</span>
            ) : (
              <>
                <span className="text-white">WINNER: </span>
                <span className="text-cyber-primary glow-text">{verdict.winnerUsername.toUpperCase()}</span>
              </>
            )}
          </motion.h2>

          {!isTie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-gray-400 font-mono text-sm"
            >
              <Crown className="w-4 h-4 text-cyber-warning" />
              <span>{verdict.winner === 'user1' ? verdict.user1Title.title : verdict.user2Title.title}</span>
            </motion.div>
          )}
        </div>

        {/* Battle Summary */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-300 font-mono text-sm md:text-base max-w-2xl mx-auto mb-8"
        >
          {verdict.summary}
        </motion.p>

        {/* Battle Closeness Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-md mx-auto"
        >
          <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
            <span>Decisive Victory</span>
            <span>Close Battle</span>
          </div>
          <div className="h-2 rounded-full bg-cyber-dark overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${verdict.margin}%` }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"
            />
          </div>
          <p className="text-center text-xs font-mono text-gray-500 mt-2">
            Battle Closeness: {verdict.margin}%
          </p>
        </motion.div>

        {/* Titles Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 grid md:grid-cols-2 gap-4"
        >
          {/* User 1 Title */}
          <div className={`p-4 rounded-lg border ${
            verdict.winner === 'user1' 
              ? 'bg-cyber-primary/10 border-cyber-primary/30' 
              : 'bg-cyber-card border-cyber-border'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{verdict.user1Title.icon}</span>
              <div>
                <p className="text-gray-400 text-xs font-mono">{user1.username}</p>
                <p className="font-cyber text-sm" style={{ color: verdict.user1Title.color }}>
                  {verdict.user1Title.title}
                </p>
              </div>
              {verdict.winner === 'user1' && (
                <Star className="w-5 h-5 text-cyber-warning ml-auto" />
              )}
            </div>
          </div>

          {/* User 2 Title */}
          <div className={`p-4 rounded-lg border ${
            verdict.winner === 'user2' 
              ? 'bg-cyber-primary/10 border-cyber-primary/30' 
              : 'bg-cyber-card border-cyber-border'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{verdict.user2Title.icon}</span>
              <div>
                <p className="text-gray-400 text-xs font-mono">{user2.username}</p>
                <p className="font-cyber text-sm" style={{ color: verdict.user2Title.color }}>
                  {verdict.user2Title.title}
                </p>
              </div>
              {verdict.winner === 'user2' && (
                <Star className="w-5 h-5 text-cyber-warning ml-auto" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 grid md:grid-cols-2 gap-4"
        >
          {/* User 1 Strengths */}
          <div className="text-center md:text-left">
            <p className="text-xs font-mono text-gray-500 mb-2">
              {user1.username}&apos;s Strengths
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {verdict.user1Strengths.length > 0 ? (
                verdict.user1Strengths.map((strength, i) => (
                  <span key={i} className="cyber-badge text-cyber-secondary border-cyber-secondary/30">
                    {strength}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-xs font-mono">—</span>
              )}
            </div>
          </div>

          {/* User 2 Strengths */}
          <div className="text-center md:text-right">
            <p className="text-xs font-mono text-gray-500 mb-2">
              {user2.username}&apos;s Strengths
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {verdict.user2Strengths.length > 0 ? (
                verdict.user2Strengths.map((strength, i) => (
                  <span key={i} className="cyber-badge text-cyber-accent border-cyber-accent/30">
                    {strength}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-xs font-mono">—</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
