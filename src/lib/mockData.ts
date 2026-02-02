/**
 * ==========================================
 * MOCK DATA GENERATOR FOR SKILLMETTER
 * ==========================================
 * 
 * Since TryHackMe doesn't provide a public API,
 * this module generates realistic mock data for demonstration.
 * 
 * In a production environment, this would be replaced with:
 * 1. Official API integration (if available)
 * 2. Authorized web scraping with rate limiting
 * 3. User-provided data through TryHackMe OAuth
 * 
 * LEGAL/ETHICAL CONSIDERATIONS:
 * - This is for educational/demonstration purposes only
 * - No actual scraping of TryHackMe is performed
 * - Users should respect TryHackMe's Terms of Service
 * - Any real implementation should check robots.txt
 * - Rate limiting should be implemented
 */

import { UserProfile, CyberDomain, Badge, Certification, ActivityEntry } from '@/types';
import { generateId } from './utils';

// Seeded random for consistent results per username
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return function() {
    hash = Math.sin(hash) * 10000;
    return hash - Math.floor(hash);
  };
}

// Generate a random number within range using seeded random
function randomInRange(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

// Badge templates
const BADGE_TEMPLATES = [
  { name: 'First Blood', description: 'Completed first room', tier: 'bronze' as const },
  { name: 'Path Finder', description: 'Completed first learning path', tier: 'bronze' as const },
  { name: 'Streak Starter', description: 'Achieved 7-day streak', tier: 'bronze' as const },
  { name: 'Network Ninja', description: 'Mastered network fundamentals', tier: 'silver' as const },
  { name: 'Web Warrior', description: 'Completed web security rooms', tier: 'silver' as const },
  { name: 'Linux Legend', description: 'Linux fundamentals mastery', tier: 'silver' as const },
  { name: 'Crypto Crusher', description: 'Solved cryptography challenges', tier: 'silver' as const },
  { name: 'Blue Team Pro', description: 'Defensive security expert', tier: 'gold' as const },
  { name: 'Red Team Elite', description: 'Offensive security master', tier: 'gold' as const },
  { name: '100 Rooms Club', description: 'Completed 100 rooms', tier: 'gold' as const },
  { name: 'Streak Master', description: '30-day streak achieved', tier: 'gold' as const },
  { name: 'Top 1%', description: 'Reached top 1% globally', tier: 'platinum' as const },
  { name: 'Advent Champion', description: 'Completed Advent of Cyber', tier: 'platinum' as const },
  { name: 'King of the Hill', description: 'Won KotH competition', tier: 'platinum' as const },
];

// Certification templates
const CERT_TEMPLATES = [
  'Jr Penetration Tester',
  'Pre Security',
  'CompTIA Pentest+',
  'Introduction to Cyber Security',
  'Web Fundamentals',
  'SOC Level 1',
  'Offensive Pentesting',
  'Red Teaming',
  'Cyber Defense',
];

// Generate random date within range
function randomDate(random: () => number, startYear: number, endYear: number): string {
  const year = randomInRange(random, startYear, endYear);
  const month = randomInRange(random, 1, 12);
  const day = randomInRange(random, 1, 28);
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Generate badges for a user
function generateBadges(random: () => number, count: number): Badge[] {
  const badges: Badge[] = [];
  const shuffled = [...BADGE_TEMPLATES].sort(() => random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    badges.push({
      id: generateId(),
      ...shuffled[i],
      earnedAt: randomDate(random, 2020, 2025),
    });
  }
  
  return badges;
}

// Generate certifications for a user
function generateCertifications(random: () => number, count: number): Certification[] {
  const certs: Certification[] = [];
  const shuffled = [...CERT_TEMPLATES].sort(() => random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    certs.push({
      id: generateId(),
      name: shuffled[i],
      earnedAt: randomDate(random, 2021, 2025),
      verified: random() > 0.2,
    });
  }
  
  return certs;
}

// Generate domain scores
function generateDomainScores(random: () => number, totalRooms: number): Record<CyberDomain, number> {
  const domains: CyberDomain[] = [
    'webSecurity', 'networkSecurity', 'linux', 'windows',
    'privilegeEscalation', 'blueTeam', 'redTeam', 'soc',
    'cloudSecurity', 'forensics', 'malware', 'osint', 'cryptography'
  ];
  
  // Create weighted distribution (some domains more popular)
  const weights = domains.map(() => random() * random());
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  
  const scores: Record<string, number> = {};
  let remaining = totalRooms;
  
  domains.forEach((domain, index) => {
    if (index === domains.length - 1) {
      scores[domain] = remaining;
    } else {
      const allocation = Math.floor((weights[index] / totalWeight) * totalRooms);
      scores[domain] = Math.min(allocation, remaining);
      remaining -= scores[domain];
    }
  });
  
  return scores as Record<CyberDomain, number>;
}

// Generate activity timeline
function generateActivityTimeline(random: () => number): ActivityEntry[] {
  const timeline: ActivityEntry[] = [];
  const now = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // More likely to have activity on recent days
    const activityChance = 0.3 + (90 - i) / 200;
    
    if (random() < activityChance) {
      timeline.push({
        date: date.toISOString().split('T')[0],
        roomsCompleted: randomInRange(random, 1, 5),
        pointsEarned: randomInRange(random, 50, 500),
      });
    }
  }
  
  return timeline;
}

// Find dominant domain
function findDominantDomains(domainScores: Record<CyberDomain, number>): [CyberDomain, CyberDomain] {
  const sorted = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a) as [CyberDomain, number][];
  
  return [sorted[0][0], sorted[1][0]];
}

/**
 * Generate a mock user profile based on username
 * Uses seeded random to ensure consistent results for the same username
 */
export function generateMockProfile(username: string): UserProfile {
  const random = seededRandom(username.toLowerCase());
  
  // Determine user "tier" based on username hash for variety
  const tierRoll = random();
  let tier: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  
  if (tierRoll < 0.1) {
    tier = 'elite';
  } else if (tierRoll < 0.35) {
    tier = 'advanced';
  } else if (tierRoll < 0.7) {
    tier = 'intermediate';
  } else {
    tier = 'beginner';
  }
  
  // Generate stats based on tier
  let globalRank: number;
  let totalScore: number;
  let roomsCompleted: number;
  let pathsCompleted: number;
  let badgeCount: number;
  let certCount: number;
  let currentStreak: number;
  let bestStreak: number;
  let eventsParticipated: number;
  
  switch (tier) {
    case 'elite':
      globalRank = randomInRange(random, 1, 5000);
      totalScore = randomInRange(random, 80000, 200000);
      roomsCompleted = randomInRange(random, 200, 500);
      pathsCompleted = randomInRange(random, 15, 30);
      badgeCount = randomInRange(random, 10, 14);
      certCount = randomInRange(random, 4, 9);
      currentStreak = randomInRange(random, 30, 365);
      bestStreak = Math.max(currentStreak, randomInRange(random, 60, 400));
      eventsParticipated = randomInRange(random, 10, 20);
      break;
    
    case 'advanced':
      globalRank = randomInRange(random, 5000, 30000);
      totalScore = randomInRange(random, 30000, 80000);
      roomsCompleted = randomInRange(random, 80, 200);
      pathsCompleted = randomInRange(random, 8, 15);
      badgeCount = randomInRange(random, 6, 10);
      certCount = randomInRange(random, 2, 5);
      currentStreak = randomInRange(random, 10, 60);
      bestStreak = Math.max(currentStreak, randomInRange(random, 20, 100));
      eventsParticipated = randomInRange(random, 5, 12);
      break;
    
    case 'intermediate':
      globalRank = randomInRange(random, 30000, 150000);
      totalScore = randomInRange(random, 8000, 30000);
      roomsCompleted = randomInRange(random, 30, 80);
      pathsCompleted = randomInRange(random, 3, 8);
      badgeCount = randomInRange(random, 3, 7);
      certCount = randomInRange(random, 1, 3);
      currentStreak = randomInRange(random, 3, 20);
      bestStreak = Math.max(currentStreak, randomInRange(random, 10, 40));
      eventsParticipated = randomInRange(random, 2, 6);
      break;
    
    default: // beginner
      globalRank = randomInRange(random, 150000, 500000);
      totalScore = randomInRange(random, 500, 8000);
      roomsCompleted = randomInRange(random, 5, 30);
      pathsCompleted = randomInRange(random, 0, 3);
      badgeCount = randomInRange(random, 1, 4);
      certCount = randomInRange(random, 0, 2);
      currentStreak = randomInRange(random, 0, 10);
      bestStreak = Math.max(currentStreak, randomInRange(random, 0, 15));
      eventsParticipated = randomInRange(random, 0, 3);
  }
  
  const domainScores = generateDomainScores(random, roomsCompleted);
  const [dominantDomain, secondaryDomain] = findDominantDomains(domainScores);
  
  const activityTimeline = generateActivityTimeline(random);
  const lastActive = activityTimeline.length > 0 
    ? activityTimeline[activityTimeline.length - 1].date 
    : randomDate(random, 2024, 2025);
  
  const joinYear = randomInRange(random, 2018, 2024);
  
  return {
    username,
    avatar: `https://tryhackme.com/img/avatars/default.png`,
    joinDate: `${joinYear}-${randomInRange(random, 1, 12).toString().padStart(2, '0')}-01`,
    country: undefined,
    
    globalRank,
    totalScore,
    level: Math.floor(totalScore / 1000) + 1,
    
    roomsCompleted,
    pathsCompleted,
    
    badges: generateBadges(random, badgeCount),
    certifications: generateCertifications(random, certCount),
    
    currentStreak,
    bestStreak,
    
    eventsParticipated,
    
    domainScores,
    
    activityTimeline,
    lastActive,
    
    isActive: new Date(lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dominantDomain,
    secondaryDomain,
  };
}

/**
 * Simulate API delay for realistic UX
 */
export async function simulateApiDelay(): Promise<void> {
  const delay = 1000 + Math.random() * 1500;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Validate if a username could exist (mock validation)
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  // Reserved names that should "fail"
  const invalidNames = ['admin', 'root', 'system', 'tryhackme', 'thm'];
  
  if (username.length < 2) {
    return { valid: false, error: 'Username must be at least 2 characters' };
  }
  
  if (username.length > 30) {
    return { valid: false, error: 'Username must be 30 characters or less' };
  }
  
  if (!/^[a-zA-Z0-9_.\-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, dots, and hyphens' };
  }
  
  if (invalidNames.includes(username.toLowerCase())) {
    return { valid: false, error: 'Profile not found or is private' };
  }
  
  return { valid: true };
}
