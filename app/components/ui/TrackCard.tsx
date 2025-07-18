'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TrackProps {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  duration?: number;
  onPlay?: () => void;
  onLike?: () => void;
  onAddToPlaylist?: () => void;
  isLiked?: boolean;
}

export default function TrackCard({
  id,
  title,
  artist,
  album,
  albumArt,
  duration,
  onPlay,
  onLike,
  onAddToPlaylist,
  isLiked = false,
}: TrackProps) {
  const [liked, setLiked] = useState(isLiked);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Default album art placeholder
  const defaultAlbumArt = 'https://via.placeholder.com/200?text=Album';

  return (
    <motion.div
      className="relative bg-white dark:bg-secondary rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all"
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-square">
        <Image
          src={albumArt || defaultAlbumArt}
          alt={`${album || title} album art`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
        
        {/* Play button overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={onPlay}
            aria-label="Play track"
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white transform transition-transform hover:scale-110"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-secondary dark:text-white line-clamp-1" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1" title={artist}>
          {artist}
        </p>
        
        {/* Bottom section with duration and actions */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDuration(duration)}
          </span>
          
          <div className="flex space-x-2">
            {/* Like button */}
            <button
              onClick={handleLike}
              aria-label={liked ? "Unlike track" : "Like track"}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              {liked ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
            
            {/* Add to playlist button */}
            <button
              onClick={onAddToPlaylist}
              aria-label="Add to playlist"
              className="text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 