/**
 * ==========================================
 * SCORING ENGINE FOR SKILLMETTER
 * ==========================================
 * 
 * This module contains the complete scoring algorithm
 * for comparing TryHackMe user profiles.
 * 
 * SCORING BREAKDOWN:
 * - Rank Score (20%): Based on global ranking
 * - Rooms Score (20%): Based on completed rooms
 * - Diversity Score (15%): Based on domain coverage
 * - Badges Score (15%): Based on badges & certifications
 * - Streak Score (10%): Based on consistency
 * - Events Score (10%): Based on paths & events
 * - Activity Score (10%): Based on recent activity
 */

import {
  UserProfile,
  ComputedScores,
  MetricComparison,
  Verdict,
  CyberTitle,
  UserInsight,
  CyberDomain,
  CYBER_TITLES,
  CYBER_DOMAIN_LABELS,
  DEFAULT_SCORING_WEIGHTS,
} from '@/types';
import {
  calculateDiversityScore,
  calculateActivityScore,
  determineWinner,
} from './utils';

// Constants for score normalization
const MAX_RANK_FOR_SCORING = 500000; // Assume max rank for normalization
const MAX_ROOMS_FOR_SCORING = 500;
const MAX_BADGES_FOR_SCORING = 50;
const MAX_CERTS_FOR_SCORING = 10;
const MAX_STREAK_FOR_SCORING = 365;
const MAX_EVENTS_FOR_SCORING = 20;
const MAX_PATHS_FOR_SCORING = 30;

/**
 * Calculate rank score (0-100)
 * Lower rank = higher score
 */
function calculateRankScore(rank: number): number {
  if (rank <= 0) return 0;
  // Logarithmic scale for ranking
  const normalizedRank = Math.min(rank, MAX_RANK_FOR_SCORING);
  const score = 100 - (Math.log10(normalizedRank) / Math.log10(MAX_RANK_FOR_SCORING)) * 100;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate rooms score (0-100)
 */
function calculateRoomsScore(roomsCompleted: number): number {
  const normalized = Math.min(roomsCompleted / MAX_ROOMS_FOR_SCORING, 1);
  // Use sqrt for diminishing returns
  return Math.sqrt(normalized) * 100;
}

/**
 * Calculate badges and certifications score (0-100)
 */
function calculateBadgesScore(badges: number, certifications: number): number {
  const badgeScore = Math.min(badges / MAX_BADGES_FOR_SCORING, 1) * 60;
  const certScore = Math.min(certifications / MAX_CERTS_FOR_SCORING, 1) * 40;
  return badgeScore + certScore;
}

/**
 * Calculate streak/consistency score (0-100)
 */
function calculateStreakScore(currentStreak: number, bestStreak: number): number {
  const currentScore = Math.min(currentStreak / MAX_STREAK_FOR_SCORING, 1) * 60;
  const bestScore = Math.min(bestStreak / MAX_STREAK_FOR_SCORING, 1) * 40;
  return currentScore + bestScore;
}

/**
 * Calculate events and paths score (0-100)
 */
function calculateEventsScore(events: number, paths: number): number {
  const eventsScore = Math.min(events / MAX_EVENTS_FOR_SCORING, 1) * 50;
  const pathsScore = Math.min(paths / MAX_PATHS_FOR_SCORING, 1) * 50;
  return eventsScore + pathsScore;
}

/**
 * Compute all scores for a user profile
 */
export function computeUserScores(profile: UserProfile): ComputedScores {
  const rankScore = calculateRankScore(profile.globalRank);
  const roomsScore = calculateRoomsScore(profile.roomsCompleted);
  const diversityScore = calculateDiversityScore(profile.domainScores);
  const badgesScore = calculateBadgesScore(
    profile.badges.length,
    profile.certifications.length
  );
  const streakScore = calculateStreakScore(profile.currentStreak, profile.bestStreak);
  const eventsScore = calculateEventsScore(
    profile.eventsParticipated,
    profile.pathsCompleted
  );
  const activityScore = calculateActivityScore(profile.lastActive);

  // Calculate weighted total score
  const weights = DEFAULT_SCORING_WEIGHTS;
  const totalScore =
    rankScore * weights.rank +
    roomsScore * weights.roomsSolved +
    diversityScore * weights.domainDiversity +
    badgesScore * weights.badgesCertifications +
    streakScore * weights.streakConsistency +
    eventsScore * weights.eventsPaths +
    activityScore * weights.activityFreshness;

  return {
    rankScore: Math.round(rankScore * 100) / 100,
    roomsScore: Math.round(roomsScore * 100) / 100,
    diversityScore: Math.round(diversityScore * 100) / 100,
    badgesScore: Math.round(badgesScore * 100) / 100,
    streakScore: Math.round(streakScore * 100) / 100,
    eventsScore: Math.round(eventsScore * 100) / 100,
    activityScore: Math.round(activityScore * 100) / 100,
    totalScore: Math.round(totalScore * 100) / 100,
  };
}

/**
 * Generate metric comparisons between two users
 */
export function generateMetricComparisons(
  user1: UserProfile,
  scores1: ComputedScores,
  user2: UserProfile,
  scores2: ComputedScores
): MetricComparison[] {
  const weights = DEFAULT_SCORING_WEIGHTS;

  const comparisons: MetricComparison[] = [
    {
      metric: 'rank',
      label: 'Global Rank',
      user1Value: user1.globalRank,
      user2Value: user2.globalRank,
      user1Percentage: scores1.rankScore,
      user2Percentage: scores2.rankScore,
      winner: determineWinner(scores1.rankScore, scores2.rankScore),
      weight: weights.rank,
    },
    {
      metric: 'rooms',
      label: 'Rooms Completed',
      user1Value: user1.roomsCompleted,
      user2Value: user2.roomsCompleted,
      user1Percentage: scores1.roomsScore,
      user2Percentage: scores2.roomsScore,
      winner: determineWinner(scores1.roomsScore, scores2.roomsScore),
      weight: weights.roomsSolved,
    },
    {
      metric: 'diversity',
      label: 'Domain Diversity',
      user1Value: scores1.diversityScore,
      user2Value: scores2.diversityScore,
      user1Percentage: scores1.diversityScore,
      user2Percentage: scores2.diversityScore,
      winner: determineWinner(scores1.diversityScore, scores2.diversityScore),
      weight: weights.domainDiversity,
    },
    {
      metric: 'badges',
      label: 'Badges & Certs',
      user1Value: user1.badges.length + user1.certifications.length,
      user2Value: user2.badges.length + user2.certifications.length,
      user1Percentage: scores1.badgesScore,
      user2Percentage: scores2.badgesScore,
      winner: determineWinner(scores1.badgesScore, scores2.badgesScore),
      weight: weights.badgesCertifications,
    },
    {
      metric: 'streak',
      label: 'Streak & Consistency',
      user1Value: user1.currentStreak,
      user2Value: user2.currentStreak,
      user1Percentage: scores1.streakScore,
      user2Percentage: scores2.streakScore,
      winner: determineWinner(scores1.streakScore, scores2.streakScore),
      weight: weights.streakConsistency,
    },
    {
      metric: 'events',
      label: 'Paths & Events',
      user1Value: user1.pathsCompleted + user1.eventsParticipated,
      user2Value: user2.pathsCompleted + user2.eventsParticipated,
      user1Percentage: scores1.eventsScore,
      user2Percentage: scores2.eventsScore,
      winner: determineWinner(scores1.eventsScore, scores2.eventsScore),
      weight: weights.eventsPaths,
    },
    {
      metric: 'activity',
      label: 'Activity Freshness',
      user1Value: scores1.activityScore,
      user2Value: scores2.activityScore,
      user1Percentage: scores1.activityScore,
      user2Percentage: scores2.activityScore,
      winner: determineWinner(scores1.activityScore, scores2.activityScore),
      weight: weights.activityFreshness,
    },
  ];

  return comparisons;
}

/**
 * Assign cyber title based on user profile analysis
 */
export function assignCyberTitle(profile: UserProfile, scores: ComputedScores): CyberTitle {
  const domainScores = profile.domainScores;
  const sortedDomains = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a) as [CyberDomain, number][];
  
  const topDomain = sortedDomains[0][0];
  const topDomainScore = sortedDomains[0][1];
  const totalRooms = Object.values(domainScores).reduce((a, b) => a + b, 0);
  
  // Check for Elite Hacker (top 1000 rank)
  if (profile.globalRank <= 1000) {
    return CYBER_TITLES.eliteHacker;
  }
  
  // Check for Consistency King (high streak)
  if (profile.currentStreak >= 100 || profile.bestStreak >= 200) {
    return CYBER_TITLES.consistencyKing;
  }
  
  // Check for All-Round Warrior (high diversity + good rooms)
  if (scores.diversityScore >= 70 && totalRooms >= 100) {
    return CYBER_TITLES.allRoundWarrior;
  }
  
  // Check for Rising Hacker (newer but active)
  const joinDate = new Date(profile.joinDate);
  const monthsSinceJoin = Math.floor(
    (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  if (monthsSinceJoin <= 6 && totalRooms >= 30 && scores.activityScore >= 80) {
    return CYBER_TITLES.risingHacker;
  }
  
  // Domain-specific titles based on top domain
  const domainTitleMap: Partial<Record<CyberDomain, keyof typeof CYBER_TITLES>> = {
    redTeam: 'redTeamPredator',
    blueTeam: 'blueTeamSentinel',
    webSecurity: 'webExploitMaster',
    soc: 'socAnalystPro',
    forensics: 'forensicDetective',
    cloudSecurity: 'cloudArchitect',
    cryptography: 'cryptoMaster',
    networkSecurity: 'networkNinja',
    linux: 'linuxLegend',
    windows: 'windowsWarrior',
    malware: 'malwareHunter',
    osint: 'osintSpecialist',
  };
  
  // If they have a clear specialization (>30% in one domain)
  if (topDomainScore / totalRooms > 0.3 && topDomainScore >= 10) {
    const titleKey = domainTitleMap[topDomain];
    if (titleKey && CYBER_TITLES[titleKey]) {
      return CYBER_TITLES[titleKey];
    }
  }
  
  // Check for Veteran Operator (long-time member)
  if (monthsSinceJoin >= 24 && totalRooms >= 50) {
    return CYBER_TITLES.veteranOperator;
  }
  
  // Default based on dominant domain
  const titleKey = domainTitleMap[topDomain];
  if (titleKey && CYBER_TITLES[titleKey]) {
    return CYBER_TITLES[titleKey];
  }
  
  return CYBER_TITLES.allRoundWarrior;
}

/**
 * Generate insights about a user's performance
 */
export function generateUserInsights(
  profile: UserProfile,
  scores: ComputedScores,
  isWinner: boolean,
  opponentProfile: UserProfile
): UserInsight[] {
  const insights: UserInsight[] = [];
  const domainScores = profile.domainScores;
  
  // Find top domains
  const sortedDomains = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a) as [CyberDomain, number][];
  
  const topDomain = sortedDomains[0];
  const secondDomain = sortedDomains[1];
  
  // Top domain insight
  if (topDomain[1] > 0) {
    insights.push({
      type: 'strength',
      message: `Dominates in ${CYBER_DOMAIN_LABELS[topDomain[0]]} with ${topDomain[1]} rooms`,
      icon: '🎯',
    });
  }
  
  // Rank insight
  if (profile.globalRank < opponentProfile.globalRank) {
    insights.push({
      type: 'strength',
      message: `Higher global rank (#${profile.globalRank.toLocaleString()})`,
      icon: '📈',
    });
  }
  
  // Streak insight
  if (profile.currentStreak >= 30) {
    insights.push({
      type: 'strength',
      message: `Impressive ${profile.currentStreak}-day active streak`,
      icon: '🔥',
    });
  } else if (profile.currentStreak < 7 && profile.bestStreak >= 30) {
    insights.push({
      type: 'weakness',
      message: `Streak dropped from ${profile.bestStreak} to ${profile.currentStreak} days`,
      icon: '📉',
    });
  }
  
  // Diversity insight
  if (scores.diversityScore >= 70) {
    insights.push({
      type: 'strength',
      message: 'Well-rounded across multiple security domains',
      icon: '🌐',
    });
  } else if (scores.diversityScore < 40) {
    insights.push({
      type: 'neutral',
      message: 'Focused specialist rather than generalist',
      icon: '🔬',
    });
  }
  
  // Activity insight
  if (scores.activityScore >= 90) {
    insights.push({
      type: 'strength',
      message: 'Highly active in recent days',
      icon: '⚡',
    });
  } else if (scores.activityScore < 50) {
    insights.push({
      type: 'weakness',
      message: 'Activity has decreased recently',
      icon: '😴',
    });
  }
  
  // Certifications insight
  if (profile.certifications.length >= 3) {
    insights.push({
      type: 'strength',
      message: `Holds ${profile.certifications.length} TryHackMe certifications`,
      icon: '📜',
    });
  }
  
  // Compare rooms with opponent
  if (profile.roomsCompleted > opponentProfile.roomsCompleted * 1.5) {
    insights.push({
      type: 'strength',
      message: `Completed ${profile.roomsCompleted - opponentProfile.roomsCompleted} more rooms than opponent`,
      icon: '🏆',
    });
  }
  
  return insights.slice(0, 5); // Limit to 5 insights
}

/**
 * Generate the final verdict
 */
export function generateVerdict(
  user1: UserProfile,
  scores1: ComputedScores,
  user2: UserProfile,
  scores2: ComputedScores
): Verdict {
  const scoreDiff = scores1.totalScore - scores2.totalScore;
  const maxScore = Math.max(scores1.totalScore, scores2.totalScore);
  const marginPercentage = Math.abs(scoreDiff) / maxScore * 100;
  
  let winner: 'user1' | 'user2' | 'tie';
  let winnerUsername: string;
  
  // Consider it a tie if difference is less than 2%
  if (marginPercentage < 2) {
    winner = 'tie';
    winnerUsername = 'TIE';
  } else if (scoreDiff > 0) {
    winner = 'user1';
    winnerUsername = user1.username;
  } else {
    winner = 'user2';
    winnerUsername = user2.username;
  }
  
  const user1Title = assignCyberTitle(user1, scores1);
  const user2Title = assignCyberTitle(user2, scores2);
  
  // Calculate strengths
  const user1Strengths: string[] = [];
  const user2Strengths: string[] = [];
  
  if (scores1.rankScore > scores2.rankScore) user1Strengths.push('Higher Rank');
  else if (scores2.rankScore > scores1.rankScore) user2Strengths.push('Higher Rank');
  
  if (scores1.roomsScore > scores2.roomsScore) user1Strengths.push('More Rooms Completed');
  else if (scores2.roomsScore > scores1.roomsScore) user2Strengths.push('More Rooms Completed');
  
  if (scores1.diversityScore > scores2.diversityScore) user1Strengths.push('Better Domain Coverage');
  else if (scores2.diversityScore > scores1.diversityScore) user2Strengths.push('Better Domain Coverage');
  
  if (scores1.badgesScore > scores2.badgesScore) user1Strengths.push('More Badges & Certs');
  else if (scores2.badgesScore > scores1.badgesScore) user2Strengths.push('More Badges & Certs');
  
  if (scores1.streakScore > scores2.streakScore) user1Strengths.push('Better Consistency');
  else if (scores2.streakScore > scores1.streakScore) user2Strengths.push('Better Consistency');
  
  if (scores1.eventsScore > scores2.eventsScore) user1Strengths.push('More Paths & Events');
  else if (scores2.eventsScore > scores1.eventsScore) user2Strengths.push('More Paths & Events');
  
  if (scores1.activityScore > scores2.activityScore) user1Strengths.push('More Recently Active');
  else if (scores2.activityScore > scores1.activityScore) user2Strengths.push('More Recently Active');
  
  // Generate summary
  let summary: string;
  if (winner === 'tie') {
    summary = `This is an incredibly close battle! Both ${user1.username} and ${user2.username} are evenly matched cyber warriors with nearly identical scores.`;
  } else {
    const winnerData = winner === 'user1' ? user1 : user2;
    const loserData = winner === 'user1' ? user2 : user1;
    const winnerTitle = winner === 'user1' ? user1Title : user2Title;
    
    if (marginPercentage > 20) {
      summary = `${winnerData.username} dominates this battle as a ${winnerTitle.title}! With a significant lead, they've proven their superior cyber skills against ${loserData.username}.`;
    } else if (marginPercentage > 10) {
      summary = `${winnerData.username} claims victory as the ${winnerTitle.title}! A solid performance that edges out ${loserData.username} in this cyber duel.`;
    } else {
      summary = `In a close battle, ${winnerData.username} narrowly defeats ${loserData.username}! Both hackers showed impressive skills, but ${winnerData.username} takes the crown.`;
    }
  }
  
  return {
    winner,
    winnerUsername,
    margin: Math.round(100 - marginPercentage),
    user1Title,
    user2Title,
    user1Strengths,
    user2Strengths,
    summary,
  };
}
