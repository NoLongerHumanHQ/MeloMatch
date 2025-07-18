/**
 * Last.fm API wrapper
 * 
 * Documentation: https://www.last.fm/api/
 */

const API_KEY = process.env.LASTFM_API_KEY || '';
const API_URL = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Make a request to the Last.fm API
 */
async function lastFmRequest(method: string, params: Record<string, string> = {}) {
  const url = new URL(API_URL);
  url.searchParams.append('method', method);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('format', 'json');
  
  // Add additional params
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Last.fm API request failed:', error);
    throw error;
  }
}

/**
 * Search for a track
 */
export async function searchTracks(query: string, limit: number = 10, page: number = 1) {
  return lastFmRequest('track.search', {
    track: query,
    limit: limit.toString(),
    page: page.toString(),
  });
}

/**
 * Get track info
 */
export async function getTrackInfo(track: string, artist: string) {
  return lastFmRequest('track.getInfo', {
    track,
    artist,
    autocorrect: '1',
  });
}

/**
 * Get similar tracks
 */
export async function getSimilarTracks(track: string, artist: string, limit: number = 10) {
  return lastFmRequest('track.getSimilar', {
    track,
    artist,
    limit: limit.toString(),
    autocorrect: '1',
  });
}

/**
 * Get top tracks
 */
export async function getTopTracks(limit: number = 10, page: number = 1) {
  return lastFmRequest('chart.getTopTracks', {
    limit: limit.toString(),
    page: page.toString(),
  });
}

/**
 * Get top artists
 */
export async function getTopArtists(limit: number = 10, page: number = 1) {
  return lastFmRequest('chart.getTopArtists', {
    limit: limit.toString(),
    page: page.toString(),
  });
}

/**
 * Get artist info
 */
export async function getArtistInfo(artist: string) {
  return lastFmRequest('artist.getInfo', {
    artist,
    autocorrect: '1',
  });
}

/**
 * Get artist top tracks
 */
export async function getArtistTopTracks(artist: string, limit: number = 10, page: number = 1) {
  return lastFmRequest('artist.getTopTracks', {
    artist,
    limit: limit.toString(),
    page: page.toString(),
    autocorrect: '1',
  });
}

/**
 * Get artist top albums
 */
export async function getArtistTopAlbums(artist: string, limit: number = 10, page: number = 1) {
  return lastFmRequest('artist.getTopAlbums', {
    artist,
    limit: limit.toString(),
    page: page.toString(),
    autocorrect: '1',
  });
}

/**
 * Get tag info
 */
export async function getTagInfo(tag: string) {
  return lastFmRequest('tag.getInfo', {
    tag,
  });
}

/**
 * Get top tracks by tag
 */
export async function getTopTracksByTag(tag: string, limit: number = 10, page: number = 1) {
  return lastFmRequest('tag.getTopTracks', {
    tag,
    limit: limit.toString(),
    page: page.toString(),
  });
}

/**
 * Map Last.fm track to our Track model
 */
export function mapLastFmTrackToTrack(track: any) {
  return {
    title: track.name,
    artist: track.artist?.name || track.artist,
    album: track.album?.title || '',
    albumArt: track.album?.image?.[3]?.['#text'] || track.image?.[3]?.['#text'] || '',
    duration: parseInt(track.duration || '0', 10) || null,
    popularity: parseFloat(track.playcount || '0') / 1000 || null,
    externalId: track.mbid || null,
    externalUrl: track.url || null,
  };
} 