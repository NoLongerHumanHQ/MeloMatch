'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/app/hooks/useTheme';
import TrackCard from '@/app/components/ui/TrackCard';
// import { useSession } from 'next-auth/react';

export default function DiscoverPage() {
  const { theme } = useTheme();
  // const { data: session } = useSession();
  
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  
  // Popular genres
  const genres = [
    'all', 'pop', 'rock', 'hip-hop', 'r&b', 'electronic', 
    'indie', 'jazz', 'classical', 'metal', 'country'
  ];
  
  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would call our API
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        
        const mockTracks = Array.from({ length: 12 }, (_, i) => ({
          id: `track-${i}`,
          title: `Track ${i + 1}`,
          artist: `Artist ${Math.floor(i / 3) + 1}`,
          album: `Album ${Math.floor(i / 4) + 1}`,
          albumArt: `https://picsum.photos/seed/${i+10}/300/300`,
          duration: 180 + Math.floor(Math.random() * 120),
          isLiked: Math.random() > 0.7,
        }));
        
        setTracks(mockTracks);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [selectedGenre]);
  
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };
  
  const handleLike = (trackId: string) => {
    // In a real implementation, this would call our API to update user preferences
    console.log(`Liked track: ${trackId}`);
  };
  
  const handlePlay = (trackId: string) => {
    // In a real implementation, this would trigger the audio player
    console.log(`Playing track: ${trackId}`);
  };
  
  const handleAddToPlaylist = (trackId: string) => {
    // In a real implementation, this would open a playlist selector modal
    console.log(`Add to playlist: ${trackId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-light pb-20">
      {/* Page header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-light dark:from-secondary dark:to-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Discover New Music</h1>
          <p className="text-accent max-w-2xl mb-8">
            Explore new tracks tailored to your taste. The more you listen and like, 
            the better our recommendations get.
          </p>
          
          {/* Genre filters */}
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recommendations grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          // Skeleton loading state
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-secondary rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => setSelectedGenre(selectedGenre)} // Retry by setting the same genre
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          // Results grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                id={track.id}
                title={track.title}
                artist={track.artist}
                album={track.album}
                albumArt={track.albumArt}
                duration={track.duration}
                isLiked={track.isLiked}
                onPlay={() => handlePlay(track.id)}
                onLike={() => handleLike(track.id)}
                onAddToPlaylist={() => handleAddToPlaylist(track.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 