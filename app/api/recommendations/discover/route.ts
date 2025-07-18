import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RecommendationEngine } from '@/app/lib/recommendations';
import * as lastFmApi from '@/app/lib/lastfm';

/**
 * GET /api/recommendations/discover
 * Returns personalized music recommendations
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // User must be logged in to get personalized recommendations
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const recommendationEngine = new RecommendationEngine();
    
    // Get personalized recommendations
    const recommendations = await recommendationEngine.getPersonalizedRecommendations(userId, limit);
    
    return NextResponse.json({
      success: true,
      recommendations
    });
  } catch (error: any) {
    console.error('Failed to get recommendations:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get recommendations'
    }, { status: 500 });
  }
}

/**
 * Fallback handler for when no recommendations are available
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { genres = [], mood, limit = 10 } = body;
    
    // Use genre or mood-based recommendations as fallback
    let tracks = [];
    
    if (genres.length > 0) {
      // Get tracks by primary genre
      const primaryGenre = genres[0];
      const response = await lastFmApi.getTopTracksByTag(primaryGenre, limit);
      tracks = response.tracks.track.map(lastFmApi.mapLastFmTrackToTrack);
    } else if (mood) {
      // Map mood to a corresponding tag
      const moodTags: Record<string, string> = {
        happy: 'feel good',
        sad: 'melancholy',
        energetic: 'energetic',
        calm: 'chill',
        focus: 'concentration'
      };
      
      const tag = moodTags[mood] || mood;
      const response = await lastFmApi.getTopTracksByTag(tag, limit);
      tracks = response.tracks.track.map(lastFmApi.mapLastFmTrackToTrack);
    } else {
      // Default to popular tracks
      const response = await lastFmApi.getTopTracks(limit);
      tracks = response.tracks.track.map(lastFmApi.mapLastFmTrackToTrack);
    }
    
    return NextResponse.json({
      success: true,
      recommendations: tracks
    });
  } catch (error: any) {
    console.error('Failed to get recommendations by preferences:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get recommendations'
    }, { status: 500 });
  }
} 