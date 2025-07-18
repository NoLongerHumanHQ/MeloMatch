# MeloMatch - Music Recommendation Engine

MeloMatch is a professional-grade music recommendation engine that helps users discover new music tailored to their unique preferences. This project demonstrates full-stack development skills using modern web technologies.

## Features

- **Personalized Music Recommendations**: Advanced recommendation algorithms using collaborative filtering, content-based filtering, and popularity-based approaches
- **User Authentication**: Secure email/password and social login with user profiles
- **Music Discovery**: Search and browse by genres, mood, and popularity
- **Interactive Features**: Like/dislike tracks, create custom playlists, share with other users
- **Modern UI/UX**: Responsive design with dark/light mode, animations, and intuitive interface
- **Performance Optimized**: Fast loading times with caching and efficient API usage

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase PostgreSQL (free tier)
- **Authentication**: NextAuth.js
- **API Integration**: Last.fm API, Spotify Web API (optional)
- **Deployment**: Vercel (optimized for free tier)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Free Supabase account (or alternative database)
- Last.fm API key (free)
- Spotify API credentials (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/melomatch.git
   cd melomatch
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and database connection string

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Recommendation Engine

The recommendation system uses multiple strategies:

1. **Collaborative Filtering**: Recommends music based on preferences of similar users
2. **Content-Based Filtering**: Analyzes audio features to recommend similar tracks
3. **Popularity-Based**: Handles cold start problem for new users
4. **Hybrid Approach**: Combines all methods for optimal recommendations

## Database Schema

```
User
- id: uuid (primary key)
- email: string (unique)
- name: string
- image: string (optional)
- createdAt: timestamp

Track
- id: uuid (primary key)
- title: string
- artist: string
- album: string
- genres: string[]
- duration: number
- popularity: number
- audioFeatures: jsonb

UserTrackInteraction
- id: uuid (primary key)
- userId: uuid (foreign key)
- trackId: uuid (foreign key)
- type: enum (LIKE, DISLIKE, PLAY, SKIP)
- createdAt: timestamp

Playlist
- id: uuid (primary key)
- name: string
- userId: uuid (foreign key)
- isPublic: boolean
- createdAt: timestamp

PlaylistTrack
- id: uuid (primary key)
- playlistId: uuid (foreign key)
- trackId: uuid (foreign key)
- addedAt: timestamp
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Sign in a user
- `GET /api/auth/session`: Get current session

### User Endpoints
- `GET /api/users/me`: Get current user profile
- `PUT /api/users/me`: Update user profile
- `GET /api/users/me/history`: Get user's listening history

### Music Endpoints
- `GET /api/tracks/search`: Search for tracks
- `GET /api/tracks/popular`: Get popular tracks
- `GET /api/tracks/:id`: Get track details
- `GET /api/artists/:id`: Get artist details

### Recommendation Endpoints
- `GET /api/recommendations/discover`: Get personalized recommendations
- `GET /api/recommendations/similar/:trackId`: Get similar tracks

### Playlist Endpoints
- `GET /api/playlists`: Get user's playlists
- `POST /api/playlists`: Create a new playlist
- `PUT /api/playlists/:id`: Update a playlist
- `DELETE /api/playlists/:id`: Delete a playlist
- `POST /api/playlists/:id/tracks`: Add tracks to a playlist

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy with default settings (Next.js framework preset)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Last.fm API](https://www.last.fm/api) for music metadata
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for additional data (optional)
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) for database and authentication 