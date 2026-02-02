// ==========================================
// TYPE DEFINITIONS FOR SKILLMETTER
// ==========================================

// Cyber domains for skill categorization
export type CyberDomain =
  | 'webSecurity'
  | 'networkSecurity'
  | 'linux'
  | 'windows'
  | 'privilegeEscalation'
  | 'blueTeam'
  | 'redTeam'
  | 'soc'
  | 'cloudSecurity'
  | 'forensics'
  | 'malware'
  | 'osint'
  | 'cryptography';

export const CYBER_DOMAIN_LABELS: Record<CyberDomain, string> = {
  webSecurity: 'Web Security',
  networkSecurity: 'Network Security',
  linux: 'Linux',
  windows: 'Windows',
  privilegeEscalation: 'Privilege Escalation',
  blueTeam: 'Blue Team',
  redTeam: 'Red Team',
  soc: 'SOC',
  cloudSecurity: 'Cloud Security',
  forensics: 'Forensics',
  malware: 'Malware Analysis',
  osint: 'OSINT',
  cryptography: 'Cryptography',
};

export const CYBER_DOMAIN_COLORS: Record<CyberDomain, string> = {
  webSecurity: '#ff6b6b',
  networkSecurity: '#4ecdc4',
  linux: '#ffd93d',
  windows: '#00b4d8',
  privilegeEscalation: '#ff00ff',
  blueTeam: '#00d4ff',
  redTeam: '#ff3366',
  soc: '#00ff88',
  cloudSecurity: '#a855f7',
  forensics: '#f97316',
  malware: '#dc2626',
  osint: '#22c55e',
  cryptography: '#8b5cf6',
};

// Badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt: string;
  imageUrl?: string; // URL to badge image from TryHackMe CDN
}

// Certification
export interface Certification {
  id: string;
  name: string;
  earnedAt: string;
  verified: boolean;
}

// Activity timeline entry
export interface ActivityEntry {
  date: string;
  roomsCompleted: number;
  pointsEarned: number;
}

// User profile data
export interface UserProfile {
  username: string;
  avatar: string;
  joinDate: string;
  country?: string;
  
  // Core stats
  globalRank: number;
  totalScore: number;
  level: number;
  
  // Rooms & Paths
  roomsCompleted: number;
  pathsCompleted: number;
  
  // Badges & Certifications
  badges: Badge[];
  certifications: Certification[];
  
  // Streaks
  currentStreak: number;
  bestStreak: number;
  
  // Events
  eventsParticipated: number;
  
  // Domain-specific room counts
  domainScores: Record<CyberDomain, number>;
  
  // Activity data
  activityTimeline: ActivityEntry[];
  lastActive: string;
  
  // Computed properties
  isActive: boolean; // Active in last 30 days
  dominantDomain: CyberDomain;
  secondaryDomain: CyberDomain;

  // Additional TryHackMe API data
  topPercentage?: number; // Percentile ranking (0-100)
  isInTopTenPercent?: boolean; // Elite status
  isSubscribed?: boolean; // Premium subscription status
  userRole?: string; // student/professional
  badgeImageURL?: string; // Profile badge image URL
}

// Scoring weights
export interface ScoringWeights {
  rank: number;
  roomsSolved: number;
  domainDiversity: number;
  badgesCertifications: number;
  streakConsistency: number;
  eventsPaths: number;
  activityFreshness: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  rank: 0.20,
  roomsSolved: 0.20,
  domainDiversity: 0.15,
  badgesCertifications: 0.15,
  streakConsistency: 0.10,
  eventsPaths: 0.10,
  activityFreshness: 0.10,
};

// Computed scores for comparison
export interface ComputedScores {
  rankScore: number;
  roomsScore: number;
  diversityScore: number;
  badgesScore: number;
  streakScore: number;
  eventsScore: number;
  activityScore: number;
  totalScore: number;
}

// Cyber title
export interface CyberTitle {
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Available cyber titles
export const CYBER_TITLES: Record<string, CyberTitle> = {
  redTeamPredator: {
    title: 'Red Team Predator',
    description: 'Dominates offensive security and penetration testing',
    icon: '🎯',
    color: '#ff3366',
  },
  blueTeamSentinel: {
    title: 'Blue Team Sentinel',
    description: 'Master of defense and threat detection',
    icon: '🛡️',
    color: '#00d4ff',
  },
  webExploitMaster: {
    title: 'Web Exploitation Master',
    description: 'Expert in web application security',
    icon: '🕷️',
    color: '#ff6b6b',
  },
  socAnalystPro: {
    title: 'SOC Analyst Pro',
    description: 'Security Operations Center specialist',
    icon: '📊',
    color: '#00ff88',
  },
  allRoundWarrior: {
    title: 'All-Round Cyber Warrior',
    description: 'Versatile across all security domains',
    icon: '⚔️',
    color: '#a855f7',
  },
  consistencyKing: {
    title: 'Consistency King',
    description: 'Unmatched dedication and daily practice',
    icon: '👑',
    color: '#ffd93d',
  },
  risingHacker: {
    title: 'Rising Hacker',
    description: 'Rapidly climbing the ranks',
    icon: '🚀',
    color: '#f97316',
  },
  forensicDetective: {
    title: 'Forensic Detective',
    description: 'Expert in digital forensics and investigation',
    icon: '🔍',
    color: '#f97316',
  },
  cloudArchitect: {
    title: 'Cloud Security Architect',
    description: 'Master of cloud infrastructure security',
    icon: '☁️',
    color: '#a855f7',
  },
  cryptoMaster: {
    title: 'Crypto Master',
    description: 'Expert in cryptography and encryption',
    icon: '🔐',
    color: '#8b5cf6',
  },
  networkNinja: {
    title: 'Network Ninja',
    description: 'Master of network protocols and security',
    icon: '🌐',
    color: '#4ecdc4',
  },
  linuxLegend: {
    title: 'Linux Legend',
    description: 'Expert in Linux systems and administration',
    icon: '🐧',
    color: '#ffd93d',
  },
  windowsWarrior: {
    title: 'Windows Warrior',
    description: 'Master of Windows security and Active Directory',
    icon: '🪟',
    color: '#00b4d8',
  },
  malwareHunter: {
    title: 'Malware Hunter',
    description: 'Expert in malware analysis and reverse engineering',
    icon: '🦠',
    color: '#dc2626',
  },
  osintSpecialist: {
    title: 'OSINT Specialist',
    description: 'Master of open-source intelligence gathering',
    icon: '🔎',
    color: '#22c55e',
  },
  eliteHacker: {
    title: 'Elite Hacker',
    description: 'Top-tier rank with exceptional skills',
    icon: '💀',
    color: '#ff00ff',
  },
  veteranOperator: {
    title: 'Veteran Operator',
    description: 'Long-standing member with extensive experience',
    icon: '🎖️',
    color: '#00ff88',
  },
};

// Insight about a user
export interface UserInsight {
  type: 'strength' | 'weakness' | 'neutral';
  message: string;
  icon: string;
}

// Comparison result for a single metric
export interface MetricComparison {
  metric: string;
  label: string;
  user1Value: number;
  user2Value: number;
  user1Percentage: number;
  user2Percentage: number;
  winner: 'user1' | 'user2' | 'tie';
  weight: number;
}

// Final verdict
export interface Verdict {
  winner: 'user1' | 'user2' | 'tie';
  winnerUsername: string;
  margin: number; // 0-100, how close the battle was
  user1Title: CyberTitle;
  user2Title: CyberTitle;
  user1Strengths: string[];
  user2Strengths: string[];
  summary: string;
}

// Complete comparison data
export interface ComparisonData {
  user1: UserProfile;
  user2: UserProfile;
  user1Scores: ComputedScores;
  user2Scores: ComputedScores;
  metricComparisons: MetricComparison[];
  user1Insights: UserInsight[];
  user2Insights: UserInsight[];
  verdict: Verdict;
  comparedAt: string;
  shareId: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form state
export interface CompareFormState {
  user1: string;
  user2: string;
  isLoading: boolean;
  error: string | null;
}
