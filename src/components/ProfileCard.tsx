'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Target, Flame, Calendar, 
  Award, TrendingUp, Clock, Shield, Star
} from 'lucide-react';
import { UserProfile, ComputedScores, CyberTitle, CYBER_DOMAIN_LABELS } from '@/types';
import { formatRank, formatNumber, getRelativeTime } from '@/lib/utils';

interface ProfileCardProps {
  profile: UserProfile;
  scores: ComputedScores;
  title: CyberTitle;
  isWinner: boolean;
  position: 'left' | 'right';
}

export default function ProfileCard({ 
  profile, 
  scores, 
  title, 
  isWinner, 
  position 
}: ProfileCardProps) {
  const borderColor = position === 'left' ? 'border-cyber-secondary' : 'border-cyber-accent';
  const glowColor = position === 'left' ? 'shadow-cyber-secondary/30' : 'shadow-cyber-accent/30';
  const accentColor = position === 'left' ? '#00d4ff' : '#ff00ff';

  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`cyber-card p-6 relative overflow-hidden ${
        isWinner ? 'winner-card border-cyber-primary' : ''
      }`}
    >
      {/* Winner Badge */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute -top-2 -right-2 z-20"
        >
          <div className="bg-cyber-primary text-cyber-dark px-4 py-1 rounded-bl-lg font-cyber text-xs flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            WINNER
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar */}
        <div className={`relative w-16 h-16 rounded-lg border-2 ${borderColor} overflow-hidden`}>
          <div className="w-full h-full bg-gradient-to-br from-cyber-card to-cyber-dark flex items-center justify-center">
            <span className="text-2xl font-cyber" style={{ color: accentColor }}>
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          {isWinner && (
            <div className="absolute -top-1 -right-1">
              <Star className="w-4 h-4 text-cyber-warning fill-cyber-warning" />
            </div>
          )}
        </div>

        {/* Username & Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-cyber text-xl text-white truncate">
            {profile.username}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{title.icon}</span>
            <span className="text-sm font-mono" style={{ color: title.color }}>
              {title.title}
            </span>
          </div>
          <p className="text-gray-500 text-xs font-mono mt-1">
            Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Total Score Display */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="text-center p-4 rounded-lg bg-cyber-dark/50 border border-cyber-border mb-6"
      >
        <p className="text-gray-500 text-xs font-mono mb-1">TOTAL BATTLE SCORE</p>
        <p className="font-cyber text-3xl" style={{ color: accentColor }}>
          {scores.totalScore.toFixed(1)}
        </p>
        <p className="text-gray-600 text-xs font-mono mt-1">out of 100</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatItem 
          icon={<Trophy className="w-4 h-4" />}
          label="Global Rank"
          value={formatRank(profile.globalRank)}
          color={accentColor}
        />
        <StatItem 
          icon={<Target className="w-4 h-4" />}
          label="Total Score"
          value={formatNumber(profile.totalScore)}
          color={accentColor}
        />
        <StatItem 
          icon={<Shield className="w-4 h-4" />}
          label="Rooms"
          value={profile.roomsCompleted.toString()}
          color={accentColor}
        />
        <StatItem 
          icon={<TrendingUp className="w-4 h-4" />}
          label="Paths"
          value={profile.pathsCompleted.toString()}
          color={accentColor}
        />
        <StatItem 
          icon={<Medal className="w-4 h-4" />}
          label="Badges"
          value={profile.badges.length.toString()}
          color={accentColor}
        />
        <StatItem 
          icon={<Award className="w-4 h-4" />}
          label="Certs"
          value={profile.certifications.length.toString()}
          color={accentColor}
        />
        <StatItem 
          icon={<Flame className="w-4 h-4" />}
          label="Streak"
          value={`${profile.currentStreak}d`}
          color={accentColor}
          highlight={profile.currentStreak >= 30}
        />
        <StatItem 
          icon={<Calendar className="w-4 h-4" />}
          label="Best Streak"
          value={`${profile.bestStreak}d`}
          color={accentColor}
        />
      </div>

      {/* Top Domains */}
      <div className="mb-4">
        <p className="text-gray-500 text-xs font-mono mb-2">TOP DOMAINS</p>
        <div className="flex flex-wrap gap-2">
          <span className="cyber-badge" style={{ 
            color: accentColor, 
            borderColor: `${accentColor}50` 
          }}>
            {CYBER_DOMAIN_LABELS[profile.dominantDomain]}
          </span>
          <span className="cyber-badge text-gray-400 border-gray-600">
            {CYBER_DOMAIN_LABELS[profile.secondaryDomain]}
          </span>
        </div>
      </div>

      {/* Activity Status */}
      <div className="flex items-center justify-between pt-4 border-t border-cyber-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500 text-xs font-mono">
            Last active {getRelativeTime(profile.lastActive)}
          </span>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          profile.isActive ? 'bg-cyber-primary' : 'bg-gray-600'
        }`} />
      </div>

      {/* Background Decoration */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-5"
        style={{ backgroundColor: accentColor }} />
    </motion.div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}

function StatItem({ icon, label, value, color, highlight }: StatItemProps) {
  return (
    <div className={`stat-card ${highlight ? 'border-cyber-warning/50' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-gray-500 text-xs font-mono">{label}</span>
      </div>
      <p className={`font-cyber text-lg ${highlight ? 'text-cyber-warning' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
