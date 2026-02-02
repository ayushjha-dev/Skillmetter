import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { fetchTHMProfile } from '@/lib/tryhackme';
import { validateUsername } from '@/lib/mockData';
import { 
  computeUserScores, 
  generateMetricComparisons, 
  generateVerdict,
  generateUserInsights
} from '@/lib/scoring';
import { ComparisonData } from '@/types';
import { sanitizeInput } from '@/lib/utils';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now - record.timestamp > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.user1 || !body.user2) {
      return NextResponse.json(
        { error: 'Both usernames are required' },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const user1 = sanitizeInput(body.user1);
    const user2 = sanitizeInput(body.user2);
    
    // Check if comparing same user
    if (user1.toLowerCase() === user2.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot compare a user with themselves' },
        { status: 400 }
      );
    }
    
    // Validate usernames
    const validation1 = validateUsername(user1);
    const validation2 = validateUsername(user2);
    
    if (!validation1.valid) {
      return NextResponse.json(
        { error: `User 1: ${validation1.error}` },
        { status: 400 }
      );
    }
    
    if (!validation2.valid) {
      return NextResponse.json(
        { error: `User 2: ${validation2.error}` },
        { status: 400 }
      );
    }
    
    // Fetch REAL profiles from TryHackMe API
    console.log(`Fetching real TryHackMe data for: ${user1} vs ${user2}`);
    
    const [profile1, profile2] = await Promise.all([
      fetchTHMProfile(user1),
      fetchTHMProfile(user2),
    ]);
    
    // Check if profiles were found
    if (!profile1) {
      return NextResponse.json(
        { error: `User "${user1}" not found on TryHackMe. Please check the username.` },
        { status: 404 }
      );
    }
    
    if (!profile2) {
      return NextResponse.json(
        { error: `User "${user2}" not found on TryHackMe. Please check the username.` },
        { status: 404 }
      );
    }
    
    console.log(`Found ${user1}: Rank #${profile1.globalRank}, Score: ${profile1.totalScore}`);
    console.log(`Found ${user2}: Rank #${profile2.globalRank}, Score: ${profile2.totalScore}`);
    
    // Compute scores
    const scores1 = computeUserScores(profile1);
    const scores2 = computeUserScores(profile2);
    
    // Generate comparisons
    const metricComparisons = generateMetricComparisons(
      profile1, scores1, profile2, scores2
    );
    
    // Generate verdict
    const verdict = generateVerdict(profile1, scores1, profile2, scores2);
    
    // Generate insights
    const user1Insights = generateUserInsights(
      profile1, scores1, verdict.winner === 'user1', profile2
    );
    const user2Insights = generateUserInsights(
      profile2, scores2, verdict.winner === 'user2', profile1
    );
    
    // Create comparison data
    const comparisonData: ComparisonData = {
      user1: profile1,
      user2: profile2,
      user1Scores: scores1,
      user2Scores: scores2,
      metricComparisons,
      user1Insights,
      user2Insights,
      verdict,
      comparedAt: new Date().toISOString(),
      shareId: nanoid(10),
    };
    
    return NextResponse.json(comparisonData);
    
  } catch (error) {
    console.error('Comparison API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
