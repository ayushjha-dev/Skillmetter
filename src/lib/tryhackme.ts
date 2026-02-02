/**
 * ==========================================
 * TRYHACKME API CLIENT (v2)
 * ==========================================
 * 
 * Fetches real user data from TryHackMe's public v2 API endpoints.
 * Based on documented API endpoints from API.md
 */

import { UserProfile, CyberDomain, Badge, Certification, ActivityEntry } from '@/types';
import { generateId } from './utils';

// API Base URLs
const THM_API_V2 = 'https://tryhackme.com/api/v2';
const THM_BADGES_CDN = 'https://tryhackme-badges.s3.amazonaws.com';

// Domain keyword mappings for categorizing rooms
const DOMAIN_KEYWORDS: Record<CyberDomain, string[]> = {
  webSecurity: ['web', 'owasp', 'sql', 'xss', 'injection', 'burp', 'http', 'api', 'jwt', 'ssrf', 'csrf', 'offensive'],
  networkSecurity: ['network', 'nmap', 'wireshark', 'tcp', 'udp', 'firewall', 'vpn', 'dns', 'dhcp', 'arp'],
  linux: ['linux', 'bash', 'shell', 'ubuntu', 'kali', 'debian', 'terminal', 'chmod', 'grep'],
  windows: ['windows', 'powershell', 'active directory', 'ad ', 'ntlm', 'kerberos', 'registry', 'mimikatz'],
  privilegeEscalation: ['privilege', 'privesc', 'escalation', 'sudo', 'suid', 'root', 'admin'],
  blueTeam: ['blue', 'defense', 'detection', 'siem', 'splunk', 'elk', 'monitoring', 'incident', 'defensive'],
  redTeam: ['red', 'offensive', 'attack', 'exploit', 'payload', 'metasploit', 'cobalt', 'pentest'],
  soc: ['soc', 'analyst', 'alert', 'triage', 'investigation', 'threat intel'],
  cloudSecurity: ['cloud', 'aws', 'azure', 'gcp', 's3', 'iam', 'kubernetes', 'docker', 'container'],
  forensics: ['forensic', 'autopsy', 'memory', 'disk', 'artifact', 'evidence', 'volatility'],
  malware: ['malware', 'reverse', 'assembly', 'binary', 'virus', 'trojan', 'ransomware', 'rat'],
  osint: ['osint', 'recon', 'reconnaissance', 'google', 'social', 'dork', 'shodan'],
  cryptography: ['crypto', 'cipher', 'encrypt', 'hash', 'rsa', 'aes', 'base64', 'decode'],
};

// Interfaces for API responses
interface THMPublicProfileResponse {
  status: string;
  data: {
    _id: string;
    id: number;
    avatar: string;
    username: string;
    level: number;
    country: string;
    about: string;
    linkedInUsername: string;
    githubUsername: string;
    twitterUsername: string;
    instagramUsername: string;
    personalWebsite: string;
    redditUsername: string;
    discordUsername: string;
    calendlyUrl: string;
    subscribed: number;
    badgesNumber: number;
    dateSignUp: string;
    certificateType: string | null;
    completedRoomsNumber: number;
    streak: number;
    rank: number;
    topPercentage: number;
    isInTopTenPercent: boolean;
    badgeImageURL: string;
    userRole: string;
  };
}

interface THMBadgeResponse {
  status: string;
  data: Array<{
    name: string;
    _id: string;
    image: string;
  }>;
}

interface THMRoom {
  _id: string;
  title: string;
  code: string;
  description: string;
  imageURL: string;
  difficulty: 'info' | 'easy' | 'medium' | 'hard' | 'insane';
  freeToUse: boolean;
  type: string;
}

interface THMRoomsResponse {
  status: string;
  data: {
    docs: THMRoom[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

/**
 * Fetch user's public profile from TryHackMe v2 API
 */
async function fetchPublicProfile(username: string): Promise<THMPublicProfileResponse['data'] | null> {
  try {
    const response = await fetch(`${THM_API_V2}/public-profile?username=${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Skillmetter/1.0 (Educational Project)',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(`Failed to fetch profile for ${username}: ${response.status}`);
      return null;
    }

    const result: THMPublicProfileResponse = await response.json();
    
    if (result.status !== 'success' || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    return null;
  }
}

/**
 * Fetch user's badges from TryHackMe v2 API
 */
async function fetchUserBadges(username: string): Promise<Badge[]> {
  try {
    const response = await fetch(`${THM_API_V2}/users/badges?username=${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Skillmetter/1.0 (Educational Project)',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const result: THMBadgeResponse = await response.json();
    
    if (result.status !== 'success' || !result.data) {
      return [];
    }

    return result.data.map((badge) => ({
      id: badge._id,
      name: formatBadgeName(badge.name),
      description: `Badge: ${formatBadgeName(badge.name)}`,
      tier: determineBadgeTier(badge.name),
      earnedAt: new Date().toISOString(),
      imageUrl: `${THM_BADGES_CDN}/${badge.image}`,
    }));
  } catch (error) {
    console.error(`Error fetching badges for ${username}:`, error);
    return [];
  }
}

/**
 * Fetch user's completed rooms from TryHackMe v2 API
 */
async function fetchCompletedRooms(userId: string, limit: number = 50, page: number = 1): Promise<THMRoom[]> {
  try {
    const response = await fetch(
      `${THM_API_V2}/public-profile/completed-rooms?user=${encodeURIComponent(userId)}&limit=${limit}&page=${page}`,
      {
        headers: {
          'User-Agent': 'Skillmetter/1.0 (Educational Project)',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const result: THMRoomsResponse = await response.json();
    
    if (result.status !== 'success' || !result.data) {
      return [];
    }

    return result.data.docs;
  } catch (error) {
    console.error(`Error fetching rooms for user ${userId}:`, error);
    return [];
  }
}

/**
 * Fetch ALL completed rooms with pagination
 */
async function fetchAllCompletedRooms(userId: string, totalRooms: number): Promise<THMRoom[]> {
  const limit = 50; // Max per page
  const totalPages = Math.ceil(totalRooms / limit);
  const allRooms: THMRoom[] = [];

  // Fetch pages in parallel (max 3 at a time to be respectful to the API)
  for (let pageGroup = 0; pageGroup < Math.ceil(totalPages / 3); pageGroup++) {
    const promises: Promise<THMRoom[]>[] = [];
    
    for (let i = 0; i < 3 && (pageGroup * 3 + i + 1) <= totalPages; i++) {
      const page = pageGroup * 3 + i + 1;
      promises.push(fetchCompletedRooms(userId, limit, page));
    }

    const results = await Promise.all(promises);
    results.forEach(rooms => allRooms.push(...rooms));
    
    // Small delay between page groups to respect rate limits
    if (pageGroup < Math.ceil(totalPages / 3) - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return allRooms;
}

/**
 * Format badge name from slug to readable format
 */
function formatBadgeName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Determine badge tier based on name
 */
function determineBadgeTier(name: string): 'bronze' | 'silver' | 'gold' | 'platinum' {
  const nameLower = name.toLowerCase();
  
  // Platinum tier badges
  if (nameLower.includes('100') || nameLower.includes('king') || nameLower.includes('elite') || 
      nameLower.includes('365') || nameLower.includes('master')) {
    return 'platinum';
  }
  
  // Gold tier badges
  if (nameLower.includes('30-day') || nameLower.includes('advent') || nameLower.includes('ctf') ||
      nameLower.includes('champion') || nameLower.includes('expert')) {
    return 'gold';
  }
  
  // Silver tier badges
  if (nameLower.includes('7-day') || nameLower.includes('blue') || nameLower.includes('red') ||
      nameLower.includes('path') || nameLower.includes('fundamentals')) {
    return 'silver';
  }
  
  // Default bronze
  return 'bronze';
}

/**
 * Categorize rooms into cyber domains based on title/description keywords
 */
function categorizeRooms(rooms: THMRoom[]): Record<CyberDomain, number> {
  const domainScores: Record<CyberDomain, number> = {
    webSecurity: 0,
    networkSecurity: 0,
    linux: 0,
    windows: 0,
    privilegeEscalation: 0,
    blueTeam: 0,
    redTeam: 0,
    soc: 0,
    cloudSecurity: 0,
    forensics: 0,
    malware: 0,
    osint: 0,
    cryptography: 0,
  };

  rooms.forEach(room => {
    const searchText = `${room.title} ${room.description} ${room.code}`.toLowerCase();
    let categorized = false;
    
    for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      if (keywords.some(keyword => searchText.includes(keyword))) {
        domainScores[domain as CyberDomain]++;
        categorized = true;
        break;
      }
    }
    
    // If not categorized, assign based on difficulty or default
    if (!categorized) {
      if (room.difficulty === 'info' || room.type === 'walkthrough') {
        domainScores.linux++; // Beginner rooms often cover Linux basics
      } else {
        domainScores.networkSecurity++; // Default to network security
      }
    }
  });

  return domainScores;
}

/**
 * Calculate difficulty-weighted score from rooms
 */
function calculateDifficultyScore(rooms: THMRoom[]): { easy: number; medium: number; hard: number; insane: number; info: number } {
  const counts = { easy: 0, medium: 0, hard: 0, insane: 0, info: 0 };
  
  rooms.forEach(room => {
    const difficulty = room.difficulty || 'easy';
    if (difficulty in counts) {
      counts[difficulty as keyof typeof counts]++;
    }
  });
  
  return counts;
}

/**
 * Find dominant domains from scores
 */
function findDominantDomains(domainScores: Record<CyberDomain, number>): [CyberDomain, CyberDomain] {
  const sorted = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a) as [CyberDomain, number][];
  
  return [sorted[0][0], sorted[1]?.[0] || sorted[0][0]];
}

/**
 * Calculate account age in days from sign-up date
 */
function calculateAccountAge(dateSignUp: string): number {
  const signUp = new Date(dateSignUp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - signUp.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Estimate paths completed based on rooms
 */
function estimatePathsCompleted(roomsCompleted: number): number {
  // TryHackMe paths typically have 10-20 rooms each
  return Math.floor(roomsCompleted / 12);
}

/**
 * Estimate certifications based on level and rooms
 */
function estimateCertifications(level: number, roomsCompleted: number, certificateType: string | null): Certification[] {
  const certs: Certification[] = [];
  
  // If they have an actual certificate from the API
  if (certificateType) {
    certs.push({
      id: generateId(),
      name: certificateType,
      earnedAt: new Date().toISOString(),
      verified: true,
    });
  }
  
  // Estimate additional certifications based on progress
  if (roomsCompleted >= 10) {
    certs.push({
      id: generateId(),
      name: 'Pre Security',
      earnedAt: new Date().toISOString(),
      verified: false,
    });
  }
  
  if (roomsCompleted >= 30 && level >= 3) {
    certs.push({
      id: generateId(),
      name: 'Introduction to Cyber Security',
      earnedAt: new Date().toISOString(),
      verified: false,
    });
  }
  
  if (roomsCompleted >= 50 && level >= 5) {
    certs.push({
      id: generateId(),
      name: 'Jr Penetration Tester',
      earnedAt: new Date().toISOString(),
      verified: false,
    });
  }

  return certs;
}

/**
 * Generate activity timeline (estimated based on streak and activity)
 */
function generateActivityTimeline(username: string, streak: number, roomsCompleted: number): ActivityEntry[] {
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeline: ActivityEntry[] = [];
  const now = new Date();

  // Generate last 30 days of activity
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const random = Math.sin(seed + i) * 10000;
    const chance = random - Math.floor(random);
    
    // Higher activity for recent days if streak is active
    const streakBonus = i <= streak ? 0.3 : 0;
    
    if (chance + streakBonus > 0.5) {
      timeline.push({
        date: date.toISOString().split('T')[0],
        roomsCompleted: Math.floor(chance * 3) + 1,
        pointsEarned: Math.floor(chance * 300) + 100,
      });
    }
  }

  return timeline;
}

/**
 * Fetch complete user profile from TryHackMe
 * Combines data from multiple v2 API endpoints
 */
export async function fetchTHMProfile(username: string): Promise<UserProfile | null> {
  try {
    console.log(`Fetching TryHackMe profile for: ${username}`);
    
    // Step 1: Fetch public profile (primary data source)
    const profile = await fetchPublicProfile(username);
    
    if (!profile) {
      console.log(`User not found: ${username}`);
      return null;
    }

    console.log(`Found user ${username}: Rank #${profile.rank}, Level ${profile.level}, ${profile.completedRoomsNumber} rooms`);

    // Step 2: Fetch badges and completed rooms in parallel
    const [badges, rooms] = await Promise.all([
      fetchUserBadges(username),
      fetchAllCompletedRooms(profile._id, profile.completedRoomsNumber),
    ]);

    console.log(`Fetched ${badges.length} badges and ${rooms.length} rooms for ${username}`);

    // Step 3: Analyze rooms for domain categorization
    let domainScores: Record<CyberDomain, number>;
    
    if (rooms.length > 0) {
      domainScores = categorizeRooms(rooms);
    } else {
      // Fallback: estimate based on available data
      domainScores = estimateDomainScores(profile.completedRoomsNumber, username);
    }

    const [dominantDomain, secondaryDomain] = findDominantDomains(domainScores);

    // Step 4: Calculate difficulty breakdown
    const difficultyBreakdown = calculateDifficultyScore(rooms);

    // Step 5: Calculate derived metrics
    const accountAgeDays = calculateAccountAge(profile.dateSignUp);
    const totalScore = calculateTotalScore(profile, difficultyBreakdown);

    // Step 6: Build complete profile
    const userProfile: UserProfile = {
      username: profile.username,
      avatar: profile.avatar || `https://tryhackme-images.s3.amazonaws.com/user-avatars/${username}.png`,
      joinDate: profile.dateSignUp.split('T')[0],
      country: profile.country?.toUpperCase(),

      // Core stats from API
      globalRank: profile.rank,
      totalScore: totalScore,
      level: profile.level,

      // Rooms & Paths
      roomsCompleted: profile.completedRoomsNumber,
      pathsCompleted: estimatePathsCompleted(profile.completedRoomsNumber),

      // Badges & Certifications
      badges: badges.length > 0 ? badges : generateEstimatedBadges(profile.badgesNumber, username),
      certifications: estimateCertifications(profile.level, profile.completedRoomsNumber, profile.certificateType),

      // Streaks
      currentStreak: profile.streak,
      bestStreak: Math.max(profile.streak, estimateBestStreak(profile.streak, accountAgeDays)),

      // Events (estimated)
      eventsParticipated: Math.floor(profile.completedRoomsNumber / 25),

      // Domain scores
      domainScores,

      // Activity data
      activityTimeline: generateActivityTimeline(username, profile.streak, profile.completedRoomsNumber),
      lastActive: new Date().toISOString().split('T')[0],

      // Computed properties
      isActive: profile.streak > 0 || accountAgeDays < 30,
      dominantDomain,
      secondaryDomain,

      // Extra metadata from API (cast to any to add extra fields)
      topPercentage: profile.topPercentage,
      isInTopTenPercent: profile.isInTopTenPercent,
      isSubscribed: profile.subscribed === 1,
      userRole: profile.userRole,
      badgeImageURL: profile.badgeImageURL,
    } as UserProfile & {
      topPercentage: number;
      isInTopTenPercent: boolean;
      isSubscribed: boolean;
      userRole: string;
      badgeImageURL: string;
    };

    return userProfile;
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    return null;
  }
}

/**
 * Calculate total score based on difficulty-weighted rooms
 */
function calculateTotalScore(
  profile: THMPublicProfileResponse['data'],
  difficultyBreakdown: { easy: number; medium: number; hard: number; insane: number; info: number }
): number {
  // Base points per difficulty
  const points = {
    info: 50,
    easy: 100,
    medium: 250,
    hard: 500,
    insane: 1000,
  };

  const roomPoints = 
    difficultyBreakdown.info * points.info +
    difficultyBreakdown.easy * points.easy +
    difficultyBreakdown.medium * points.medium +
    difficultyBreakdown.hard * points.hard +
    difficultyBreakdown.insane * points.insane;

  // If we don't have room breakdown, estimate
  if (roomPoints === 0 && profile.completedRoomsNumber > 0) {
    return profile.completedRoomsNumber * 150; // Average estimate
  }

  return roomPoints;
}

/**
 * Estimate domain scores when room data is unavailable
 */
function estimateDomainScores(totalRooms: number, username: string): Record<CyberDomain, number> {
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const domains: CyberDomain[] = [
    'webSecurity', 'networkSecurity', 'linux', 'windows',
    'privilegeEscalation', 'blueTeam', 'redTeam', 'soc',
    'cloudSecurity', 'forensics', 'malware', 'osint', 'cryptography'
  ];

  const weights = domains.map((_, i) => random(i) * random(i + 10));
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

/**
 * Generate estimated badges when API returns none
 */
function generateEstimatedBadges(badgeCount: number, username: string): Badge[] {
  const badgeTemplates = [
    { name: 'First 4 Rooms', tier: 'bronze' as const },
    { name: '7 Day Streak', tier: 'bronze' as const },
    { name: 'Path Finder', tier: 'bronze' as const },
    { name: 'Linux Fundamentals', tier: 'silver' as const },
    { name: 'Network Fundamentals', tier: 'silver' as const },
    { name: 'Web Security', tier: 'silver' as const },
    { name: 'Blue Team', tier: 'gold' as const },
    { name: 'Red Team', tier: 'gold' as const },
    { name: '30 Day Streak', tier: 'gold' as const },
    { name: 'Advent of Cyber', tier: 'gold' as const },
    { name: '100 Rooms', tier: 'platinum' as const },
    { name: 'King of the Hill', tier: 'platinum' as const },
  ];

  const count = Math.min(badgeCount, badgeTemplates.length);
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return badgeTemplates.slice(0, count).map((badge, i) => ({
    id: generateId(),
    name: badge.name,
    description: `Achievement: ${badge.name}`,
    tier: badge.tier,
    earnedAt: new Date(Date.now() - (seed + i) * 86400000 * 5).toISOString(),
  }));
}

/**
 * Estimate best streak based on current streak and account age
 */
function estimateBestStreak(currentStreak: number, accountAgeDays: number): number {
  // Best streak is likely at least the current streak
  // Plus some estimate based on account age
  const potentialMax = Math.min(365, Math.floor(accountAgeDays / 10));
  return Math.max(currentStreak, Math.floor(potentialMax * 0.3));
}

/**
 * Check if a TryHackMe user exists
 */
export async function checkUserExists(username: string): Promise<boolean> {
  try {
    const profile = await fetchPublicProfile(username);
    return profile !== null;
  } catch {
    return false;
  }
}

/**
 * Get country flag emoji from country code
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

/**
 * Get full country name from code
 */
export function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'IN': 'India',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'BR': 'Brazil',
    'JP': 'Japan',
    'KR': 'South Korea',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'FI': 'Finland',
    'PL': 'Poland',
    'ES': 'Spain',
    'IT': 'Italy',
    'RU': 'Russia',
    'CN': 'China',
    'MX': 'Mexico',
    'AR': 'Argentina',
    'ZA': 'South Africa',
    'NG': 'Nigeria',
    'EG': 'Egypt',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'VN': 'Vietnam',
    'TH': 'Thailand',
    'MY': 'Malaysia',
    'SG': 'Singapore',
    'NZ': 'New Zealand',
    'IE': 'Ireland',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'BE': 'Belgium',
    'PT': 'Portugal',
    'GR': 'Greece',
    'CZ': 'Czech Republic',
    'RO': 'Romania',
    'HU': 'Hungary',
    'UA': 'Ukraine',
    'TR': 'Turkey',
    'IL': 'Israel',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
  };
  
  return countries[code?.toUpperCase()] || code || 'Unknown';
}
