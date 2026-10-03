export type GameCategory = 'Action' | 'Arcade' | 'Puzzle' | 'Retro' | 'Adventure' | 'Casual';

export interface UserProfile {
  id: string;
  gamerTag: string;
  isGoogleLinked: boolean;
  googleEmail?: string;
  googleName?: string;
  googleAvatarUrl?: string;
  linkedAt?: string;
  followingCreators?: string[];
  followingTags?: string[];
}

export interface CreatorProfile {
  name: string;
  bio?: string;
  avatarSeed?: string;
  followersCount: number;
  gamesCount: number;
  totalPlays: number;
}

export interface TagInfo {
  name: string;
  count: number;
  isTrending?: boolean;
}

export interface Review {
  id: string;
  gameId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  helpfulVotes: number;
  hasVotedHelpful?: boolean;
  avatarSeed?: string;
  userProfileId?: string;
  isGoogleVerified?: boolean;
}

export interface Game {
  id: string;
  title: string;
  author: string;
  authorBio?: string;
  description: string;
  instructions: string;
  category: GameCategory;
  tags: string[];
  rating: number; // e.g. 4.8
  ratingsCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  playCount: number;
  code: string; // HTML/JS/CSS source code
  thumbnailGradient: string;
  iconName: string;
  createdAt: string;
  isUserSubmitted?: boolean;
}

export type SortOption = 'highest-rated' | 'most-played' | 'newest' | 'alphabetical';
