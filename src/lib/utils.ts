import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format rank with ordinal suffix
 */
export function formatRank(rank: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = rank % 100;
  return rank.toLocaleString() + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Calculate percentage between two values
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Validate TryHackMe username format
 */
export function isValidUsername(username: string): boolean {
  // TryHackMe usernames: alphanumeric, underscores, hyphens, dots, 2-30 chars
  // Examples: ShadowXHat, john_doe, user.name, cyber-hacker123
  const usernameRegex = /^[a-zA-Z0-9_.\-]{2,30}$/;
  return usernameRegex.test(username);
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calculate domain diversity score (0-100)
 * Higher score = more balanced across domains
 */
export function calculateDiversityScore(domainScores: Record<string, number>): number {
  const values = Object.values(domainScores);
  const total = values.reduce((a, b) => a + b, 0);
  
  if (total === 0) return 0;
  
  // Calculate coefficient of variation (lower = more diverse)
  const mean = total / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100;
  
  // Convert to diversity score (0-100, higher is more diverse)
  return Math.max(0, Math.min(100, 100 - cv));
}

/**
 * Determine winner between two values
 */
export function determineWinner(
  value1: number,
  value2: number,
  higherIsBetter: boolean = true
): 'user1' | 'user2' | 'tie' {
  if (value1 === value2) return 'tie';
  if (higherIsBetter) {
    return value1 > value2 ? 'user1' : 'user2';
  }
  return value1 < value2 ? 'user1' : 'user2';
}

/**
 * Calculate activity freshness score (0-100)
 */
export function calculateActivityScore(lastActive: string): number {
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const daysSinceActive = Math.floor(
    (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceActive <= 1) return 100;
  if (daysSinceActive <= 7) return 90;
  if (daysSinceActive <= 14) return 75;
  if (daysSinceActive <= 30) return 60;
  if (daysSinceActive <= 60) return 40;
  if (daysSinceActive <= 90) return 25;
  return 10;
}

/**
 * Get color based on score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#00ff88';
  if (score >= 60) return '#00d4ff';
  if (score >= 40) return '#ffd93d';
  if (score >= 20) return '#f97316';
  return '#ff3366';
}

/**
 * Delay function for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
