'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-secondary to-secondary-light dark:from-secondary dark:to-black">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-pulse-slow">
            MeloMatch
          </h1>
          <p className="text-xl md:text-2xl text-accent max-w-2xl mx-auto mb-12">
            Discover music that matches your unique taste. 
            Personalized recommendations powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/discover" 
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all"
            >
              Start Discovering
            </Link>
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-white font-semibold rounded-full transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white dark:bg-secondary-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why MeloMatch?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-secondary p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Personalized Recommendations</h3>
              <p className="text-gray-600 dark:text-accent">Advanced algorithms analyze your listening history to suggest songs you'll love.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-secondary p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Create Custom Playlists</h3>
              <p className="text-gray-600 dark:text-accent">Build and share your perfect playlists for any mood or occasion.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-secondary p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Discover Hidden Gems</h3>
              <p className="text-gray-600 dark:text-accent">Find underrated artists and tracks that match your music taste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to discover your next favorite song?</h2>
          <Link 
            href="/signup" 
            className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-primary font-semibold rounded-full transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-secondary dark:bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-accent text-sm mb-4 md:mb-0">© 2023 MeloMatch. All rights reserved.</p>
            <div className="flex space-x-4">
              <button 
                onClick={toggleTheme}
                className="text-accent hover:text-white transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 