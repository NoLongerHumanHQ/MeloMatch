import { PrismaClient, Track, User, UserTrackInteraction } from '@prisma/client';
import * as lastFmApi from './lastfm';

const prisma = new PrismaClient();

/**
 * Recommendation engine for music recommendations
 */
export class RecommendationEngine {
  /**
   * Get personalized recommendations for a user
   * Combines multiple recommendation strategies
   */
  async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Track[]> {
    // Get user's listening history
    const userHistory = await this.getUserHistory(userId);
    
    if (userHistory.length === 0) {
      // Cold start problem: return popular tracks if user has no history
      return this.getPopularRecommendations(limit);
    }
    
    // Combine different recommendation approaches with weights
    const [collaborativeRecs, contentRecs, popularRecs] = await Promise.all([
      this.getCollaborativeFilteringRecommendations(userId, limit * 2),
      this.getContentBasedRecommendations(userId, limit * 2),
      this.getPopularRecommendations(limit)
    ]);
    
    // Combine and deduplicate recommendations
    const recommendations = this.combineRecommendations(
      collaborativeRecs, 
      contentRecs, 
      popularRecs,
      { collaborative: 0.6, content: 0.3, popular: 0.1 }
    );
    
    // Filter out tracks the user has already interacted with
    const filteredRecs = await this.filterOutUserHistory(recommendations, userId);
    
    return filteredRecs.slice(0, limit);
  }
  
  /**
   * Get user's listening history
   */
  private async getUserHistory(userId: string): Promise<UserTrackInteraction[]> {
    return prisma.userTrackInteraction.findMany({
      where: { userId },
      include: { track: true },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  /**
   * Get recommendations based on similar users' preferences (collaborative filtering)
   */
  private async getCollaborativeFilteringRecommendations(userId: string, limit: number): Promise<Track[]> {
    // Find users with similar taste
    const similarUsers = await this.findSimilarUsers(userId);
    
    if (similarUsers.length === 0) {
      return [];
    }
    
    // Get tracks liked by similar users that current user hasn't interacted with
    const recommendedTracks = await prisma.track.findMany({
      where: {
        interactions: {
          some: {
            userId: { in: similarUsers.map(u => u.id) },
            type: 'LIKE'
          },
          none: {
            userId
          }
        }
      },
      take: limit
    });
    
    return recommendedTracks;
  }
  
  /**
   * Find users with similar taste based on track interactions
   */
  private async findSimilarUsers(userId: string): Promise<User[]> {
    // Get current user's liked tracks
    const userLikes = await prisma.userTrackInteraction.findMany({
      where: { 
        userId,
        type: 'LIKE' 
      },
      select: { trackId: true }
    });
    
    if (userLikes.length === 0) {
      return [];
    }
    
    // Find users who liked the same tracks
    const similarUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        interactions: {
          some: {
            trackId: { in: userLikes.map(like => like.trackId) },
            type: 'LIKE'
          }
        }
      },
      take: 10
    });
    
    return similarUsers;
  }
  
  /**
   * Get recommendations based on audio features (content-based filtering)
   */
  private async getContentBasedRecommendations(userId: string, limit: number): Promise<Track[]> {
    // Get user's most recent liked tracks
    const recentLikes = await prisma.userTrackInteraction.findMany({
      where: { 
        userId,
        type: 'LIKE'
      },
      include: { 
        track: {
          include: { audioFeatures: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    if (recentLikes.length === 0) {
      return [];
    }
    
    // Extract audio features from liked tracks
    const likedFeatures = recentLikes
      .filter(like => like.track.audioFeatures)
      .map(like => like.track.audioFeatures!);
      
    if (likedFeatures.length === 0) {
      // Fall back to Last.fm similar tracks if no audio features available
      const track = recentLikes[0].track;
      try {
        const similarTracks = await lastFmApi.getSimilarTracks(track.title, track.artist, limit);
        return similarTracks.similartracks.track.map(lastFmApi.mapLastFmTrackToTrack);
      } catch (error) {
        console.error('Failed to get similar tracks from Last.fm:', error);
        return [];
      }
    }
    
    // Average the user's preferred audio features
    const avgFeatures = this.calculateAverageFeatures(likedFeatures);
    
    // Find tracks with similar audio features
    const similarTracks = await prisma.track.findMany({
      where: {
        audioFeatures: {
          energy: { gte: avgFeatures.energy * 0.8, lte: avgFeatures.energy * 1.2 },
          danceability: { gte: avgFeatures.danceability * 0.8, lte: avgFeatures.danceability * 1.2 },
          valence: { gte: avgFeatures.valence * 0.8, lte: avgFeatures.valence * 1.2 },
        },
        id: { notIn: recentLikes.map(like => like.trackId) }
      },
      include: { audioFeatures: true },
      take: limit
    });
    
    return similarTracks;
  }
  
  /**
   * Calculate average audio features from a list of features
   */
  private calculateAverageFeatures(features: any[]): Record<string, number> {
    const featureKeys = ['energy', 'danceability', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'speechiness'];
    const avgFeatures: Record<string, number> = {};
    
    featureKeys.forEach(key => {
      const validValues = features
        .map(f => f[key])
        .filter(v => v !== null && v !== undefined);
        
      if (validValues.length > 0) {
        avgFeatures[key] = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
      } else {
        avgFeatures[key] = 0.5; // Default middle value if no data
      }
    });
    
    return avgFeatures;
  }
  
  /**
   * Get popular tracks (for cold start and fallback)
   */
  private async getPopularRecommendations(limit: number): Promise<Track[]> {
    try {
      // Try to get from database first
      const popularTracks = await prisma.track.findMany({
        orderBy: { popularity: 'desc' },
        take: limit
      });
      
      if (popularTracks.length > 0) {
        return popularTracks;
      }
      
      // Fall back to Last.fm top tracks
      const lastFmTopTracks = await lastFmApi.getTopTracks(limit);
      return lastFmTopTracks.tracks.track.map(lastFmApi.mapLastFmTrackToTrack);
    } catch (error) {
      console.error('Failed to get popular recommendations:', error);
      return [];
    }
  }
  
  /**
   * Filter out tracks the user has already interacted with
   */
  private async filterOutUserHistory(recommendations: Track[], userId: string): Promise<Track[]> {
    const userInteractions = await prisma.userTrackInteraction.findMany({
      where: { userId },
      select: { trackId: true }
    });
    
    const interactedTrackIds = new Set(userInteractions.map(i => i.trackId));
    
    return recommendations.filter(track => !interactedTrackIds.has(track.id));
  }
  
  /**
   * Combine recommendations from different sources with weights
   */
  private combineRecommendations(
    collaborative: Track[], 
    contentBased: Track[],
    popular: Track[],
    weights: { collaborative: number, content: number, popular: number }
  ): Track[] {
    // Normalize weights
    const totalWeight = weights.collaborative + weights.content + weights.popular;
    const normalizedWeights = {
      collaborative: weights.collaborative / totalWeight,
      content: weights.content / totalWeight,
      popular: weights.popular / totalWeight
    };
    
    // Calculate how many tracks to take from each source
    const totalTracks = collaborative.length + contentBased.length + popular.length;
    const maxTracks = Math.min(totalTracks, 50); // Cap at 50 tracks
    
    const tracksToTake = {
      collaborative: Math.floor(maxTracks * normalizedWeights.collaborative),
      content: Math.floor(maxTracks * normalizedWeights.content),
      popular: Math.floor(maxTracks * normalizedWeights.popular)
    };
    
    // Combine tracks
    const combined = [
      ...collaborative.slice(0, tracksToTake.collaborative),
      ...contentBased.slice(0, tracksToTake.content),
      ...popular.slice(0, tracksToTake.popular)
    ];
    
    // Deduplicate by track id
    const uniqueTracks = Array.from(
      new Map(combined.map(track => [track.id, track])).values()
    );
    
    return uniqueTracks;
  }
  
  /**
   * Get similar tracks based on a given track
   */
  async getSimilarTracks(trackId: string, limit: number = 10): Promise<Track[]> {
    try {
      // Get the source track
      const track = await prisma.track.findUnique({
        where: { id: trackId },
        include: { audioFeatures: true }
      });
      
      if (!track) {
        throw new Error('Track not found');
      }
      
      if (track.audioFeatures) {
        // Content-based approach using audio features
        const similarTracks = await prisma.track.findMany({
          where: {
            id: { not: trackId },
            audioFeatures: {
              energy: { gte: track.audioFeatures.energy * 0.8, lte: track.audioFeatures.energy * 1.2 },
              danceability: { gte: track.audioFeatures.danceability * 0.8, lte: track.audioFeatures.danceability * 1.2 },
              valence: { gte: track.audioFeatures.valence * 0.8, lte: track.audioFeatures.valence * 1.2 },
            }
          },
          take: limit
        });
        
        if (similarTracks.length > 0) {
          return similarTracks;
        }
      }
      
      // Fall back to Last.fm similar tracks API
      const similarTracks = await lastFmApi.getSimilarTracks(track.title, track.artist, limit);
      return similarTracks.similartracks.track.map(lastFmApi.mapLastFmTrackToTrack);
    } catch (error) {
      console.error('Failed to get similar tracks:', error);
      return [];
    }
  }
} 