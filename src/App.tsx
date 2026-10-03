import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Plus, Gamepad2, UserCheck, Star, Tag, Filter, X, Users, RefreshCw } from 'lucide-react';
import { Game, Review, SortOption, UserProfile } from './types';
import { INITIAL_GAMES, INITIAL_REVIEWS } from './data/initialGames';
import { Navbar } from './components/Navbar';
import { GameCard } from './components/GameCard';
import { GamePlayerModal } from './components/GamePlayerModal';
import { GameSubmitModal } from './components/GameSubmitModal';
import { GoogleProfileModal } from './components/GoogleProfileModal';
import { PopularTagsCloud } from './components/PopularTagsCloud';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { FollowingModal } from './components/FollowingModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const STORAGE_GAMES_KEY = 'arcade_games_v2';
const STORAGE_REVIEWS_KEY = 'arcade_reviews_v2';
const STORAGE_FAVORITES_KEY = 'arcade_favorites_v2';
const STORAGE_PROFILE_KEY = 'arcade_user_profile_v2';
const STORAGE_FOLLOWING_CREATORS_KEY = 'arcade_following_creators_v2';
const STORAGE_FOLLOWING_TAGS_KEY = 'arcade_following_tags_v2';
const STORAGE_CREATOR_FOLLOWERS_KEY = 'arcade_creator_followers_v2';

const BUILT_IN_GAME_IDS = [
  'cosmic-orbit',
  'neon-snake',
  'pixel-dungeon',
  'cyber-pong',
  'block-blaster',
  'community-neon-hopper',
  'community-cyber-dodge',
  'community-quantum-grid',
  'community-particle-blitz'
];

export default function App() {
  // User Profile State (Gamer ID & Google Link)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_PROFILE_KEY) || localStorage.getItem('arcade_user_profile_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    const randomId = 'ARC-' + Math.floor(1000 + Math.random() * 9000);
    return {
      id: randomId,
      gamerTag: 'Player_' + randomId.split('-')[1],
      isGoogleLinked: false,
      googleEmail: 'hb2610502@ggm.goe.go.kr'
    };
  });

  // Games state - all pre-packaged games erased
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem(STORAGE_GAMES_KEY) || localStorage.getItem('arcade_games_v1');
    if (saved) {
      try {
        const parsed: Game[] = JSON.parse(saved);
        const filtered = parsed.filter(
          (g) =>
            g.isUserSubmitted === true &&
            !BUILT_IN_GAME_IDS.includes(g.id) &&
            !g.id.startsWith('community-')
        );
        return filtered;
      } catch (e) {
        console.error('Failed to parse saved games', e);
      }
    }
    return INITIAL_GAMES; // empty array []
  });

  // Reviews state - clean of any demo games
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem(STORAGE_REVIEWS_KEY) || localStorage.getItem('arcade_reviews_v1');
    if (saved) {
      try {
        const parsed: Record<string, Review[]> = JSON.parse(saved);
        const cleanReviews: Record<string, Review[]> = {};
        Object.entries(parsed).forEach(([gameId, revs]) => {
          if (!BUILT_IN_GAME_IDS.includes(gameId) && !gameId.startsWith('community-')) {
            cleanReviews[gameId] = revs;
          }
        });
        return cleanReviews;
      } catch (e) {
        console.error('Failed to parse saved reviews', e);
      }
    }
    return INITIAL_REVIEWS; // empty object {}
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (saved) {
      try {
        const parsed: string[] = JSON.parse(saved);
        return parsed.filter(
          (id) => !BUILT_IN_GAME_IDS.includes(id) && !id.startsWith('community-')
        );
      } catch (e) {}
    }
    return [];
  });

  // Following Creators state
  const [followingCreators, setFollowingCreators] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_FOLLOWING_CREATORS_KEY);
    if (saved) {
      try {
        const parsed: string[] = JSON.parse(saved);
        return parsed.filter(
          (author) => !['RetroNova', 'PixelPilot', 'CyberCrafter', 'AstroDev'].includes(author)
        );
      } catch (e) {}
    }
    return [];
  });

  // Following Tags state
  const [followingTags, setFollowingTags] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_FOLLOWING_TAGS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Creator Follower Counts state
  const [creatorFollowersMap, setCreatorFollowersMap] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(STORAGE_CREATOR_FOLLOWERS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFollowedTagsOnly, setShowFollowedTagsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('highest-rated');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [activeCreatorModal, setActiveCreatorModal] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      followingCreators,
      followingTags
    };
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));
  }, [userProfile, followingCreators, followingTags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviewsMap));
  }, [reviewsMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_FOLLOWING_CREATORS_KEY, JSON.stringify(followingCreators));
  }, [followingCreators]);

  useEffect(() => {
    localStorage.setItem(STORAGE_FOLLOWING_TAGS_KEY, JSON.stringify(followingTags));
  }, [followingTags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CREATOR_FOLLOWERS_KEY, JSON.stringify(creatorFollowersMap));
  }, [creatorFollowersMap]);

  // Actions
  const handlePlayGame = (game: Game) => {
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, playCount: g.playCount + 1 } : g))
    );
    setActiveGame({ ...game, playCount: game.playCount + 1 });
  };

  const handleOpenReviews = (game: Game) => {
    setActiveGame(game);
  };

  const handleToggleFavorite = (gameId: string) => {
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const handleToggleFollowCreator = (authorName: string) => {
    const isCurrentlyFollowing = followingCreators.includes(authorName);
    if (isCurrentlyFollowing) {
      setFollowingCreators((prev) => prev.filter((name) => name !== authorName));
      setCreatorFollowersMap((prev) => ({
        ...prev,
        [authorName]: Math.max(0, (prev[authorName] || 1) - 1)
      }));
    } else {
      setFollowingCreators((prev) => [...prev, authorName]);
      setCreatorFollowersMap((prev) => ({
        ...prev,
        [authorName]: (prev[authorName] || 0) + 1
      }));
    }
  };

  const handleToggleFollowTag = (rawTag: string) => {
    const normalized = rawTag.toLowerCase().trim();
    if (!normalized) return;
    setFollowingTags((prev) =>
      prev.includes(normalized)
        ? prev.filter((t) => t !== normalized)
        : [...prev, normalized]
    );
  };

  const handleDeleteGame = (gameId: string) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
    setReviewsMap((prev) => {
      const copy = { ...prev };
      delete copy[gameId];
      return copy;
    });
    setFavorites((prev) => prev.filter((id) => id !== gameId));
    if (activeGame?.id === gameId) {
      setActiveGame(null);
    }
  };

  const handleAddReview = (
    reviewData: Omit<Review, 'id' | 'gameId' | 'date' | 'helpfulVotes'>
  ) => {
    if (!activeGame) return;

    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      gameId: activeGame.id,
      date: new Date().toISOString().split('T')[0],
      helpfulVotes: 0,
      userProfileId: userProfile.id,
      isGoogleVerified: userProfile.isGoogleLinked
    };

    const existing = reviewsMap[activeGame.id] || [];
    const updatedReviews = [newReview, ...existing];

    setReviewsMap((prev) => ({
      ...prev,
      [activeGame.id]: updatedReviews
    }));

    // Recalculate game ratings
    setGames((prevGames) =>
      prevGames.map((g) => {
        if (g.id === activeGame.id) {
          const newCount = g.ratingsCount + 1;
          const currentDist = { ...g.ratingDistribution };
          currentDist[reviewData.rating as 1 | 2 | 3 | 4 | 5] =
            (currentDist[reviewData.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1;

          let totalScore = 0;
          Object.entries(currentDist).forEach(([star, cnt]) => {
            totalScore += Number(star) * cnt;
          });
          const newAvg = Number((totalScore / newCount).toFixed(1));

          const updatedGame = {
            ...g,
            ratingsCount: newCount,
            rating: newAvg,
            ratingDistribution: currentDist
          };

          setActiveGame(updatedGame);
          return updatedGame;
        }
        return g;
      })
    );
  };

  const handleQuickRate = (gameId: string, rating: number) => {
    setGames((prevGames) =>
      prevGames.map((g) => {
        if (g.id === gameId) {
          const newCount = g.ratingsCount + 1;
          const currentDist = { ...g.ratingDistribution };
          currentDist[rating as 1 | 2 | 3 | 4 | 5] =
            (currentDist[rating as 1 | 2 | 3 | 4 | 5] || 0) + 1;

          let totalScore = 0;
          Object.entries(currentDist).forEach(([star, cnt]) => {
            totalScore += Number(star) * cnt;
          });
          const newAvg = Number((totalScore / newCount).toFixed(1));

          const updated = {
            ...g,
            ratingsCount: newCount,
            rating: newAvg,
            ratingDistribution: currentDist
          };
          if (activeGame?.id === gameId) setActiveGame(updated);
          return updated;
        }
        return g;
      })
    );
  };

  const handleVoteHelpful = (reviewId: string) => {
    if (!activeGame) return;

    setReviewsMap((prev) => {
      const currentList = prev[activeGame.id] || [];
      const updatedList = currentList.map((r) => {
        if (r.id === reviewId) {
          const hasVoted = r.hasVotedHelpful;
          return {
            ...r,
            helpfulVotes: hasVoted ? r.helpfulVotes - 1 : r.helpfulVotes + 1,
            hasVotedHelpful: !hasVoted
          };
        }
        return r;
      });
      return {
        ...prev,
        [activeGame.id]: updatedList
      };
    });
  };

  const handlePublishGame = (newGame: Game) => {
    setGames((prev) => [newGame, ...prev]);
    setReviewsMap((prev) => ({
      ...prev,
      [newGame.id]: [
        {
          id: 'initial-' + Date.now(),
          gameId: newGame.id,
          userName: newGame.author,
          rating: 5,
          title: 'Welcome to ' + newGame.title + '!',
          comment: 'Enjoy playing my new game! Let me know what features you want next in the reviews.',
          date: new Date().toISOString().split('T')[0],
          helpfulVotes: 1,
          userProfileId: userProfile.id,
          isGoogleVerified: userProfile.isGoogleLinked
        }
      ]
    }));
    // If author has no follower count yet, seed it with 1
    if (!creatorFollowersMap[newGame.author]) {
      setCreatorFollowersMap((prev) => ({ ...prev, [newGame.author]: 1 }));
    }
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return games
      .filter((g) => {
        // Following Category Filter
        if (selectedCategory === 'Following') {
          if (!followingCreators.includes(g.author)) return false;
        } else if (selectedCategory !== 'All' && g.category !== selectedCategory) {
          return false;
        }

        // Favorites filter
        if (showFavoritesOnly && !favorites.includes(g.id)) return false;

        // Specific Tag filter from Tag Cloud
        if (selectedTag) {
          const hasTag = g.tags.some(
            (t) => t.toLowerCase() === selectedTag.toLowerCase()
          );
          if (!hasTag) return false;
        }

        // Followed Tags filter
        if (showFollowedTagsOnly) {
          const hasAnyFollowedTag = g.tags.some((t) =>
            followingTags.map((x) => x.toLowerCase()).includes(t.toLowerCase())
          );
          if (!hasAnyFollowedTag) return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const cleanQ = q.startsWith('#') ? q.slice(1) : q;
          const matchTitle = g.title.toLowerCase().includes(q);
          const matchAuthor = g.author.toLowerCase().includes(q);
          const matchTags = g.tags.some((t) =>
            t.toLowerCase().includes(cleanQ)
          );
          const matchDesc = g.description.toLowerCase().includes(q);
          return matchTitle || matchAuthor || matchTags || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest-rated') return b.rating - a.rating;
        if (sortBy === 'most-played') return b.playCount - a.playCount;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [
    games,
    selectedCategory,
    followingCreators,
    showFavoritesOnly,
    favorites,
    selectedTag,
    showFollowedTagsOnly,
    followingTags,
    searchQuery,
    sortBy
  ]);

  const categories = ['All', 'Following', 'Action', 'Arcade', 'Puzzle', 'Retro', 'Adventure', 'Casual'];

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedTag(null);
    setShowFollowedTagsOnly(false);
    setShowFavoritesOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedTag !== null ||
    showFollowedTagsOnly ||
    showFavoritesOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        followingCount={followingCreators.length + followingTags.length}
        onOpenFollowingModal={() => setIsFollowingModalOpen(true)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        profile={{
          ...userProfile,
          followingCreators,
          followingTags
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Showcase Banner */}
        <section className="relative rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 overflow-hidden shadow-lg">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Community Game Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Play, Rate, and Share Games Made by Everyone
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-xl">
                A community arcade where anyone can submit web games directly or play titles right inside the browser. Follow your favorite creators, filter games by popular tags, and share reviews!
              </p>
            </div>

            {/* Quick Action Boxes */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Your Game Code</span>
              </button>
            </div>
          </div>
        </section>

        {/* Feature: Popular Tags Cloud Component */}
        <PopularTagsCloud
          games={games}
          selectedTag={selectedTag}
          onSelectTag={(tag) => {
            setSelectedTag(tag);
            if (showFollowedTagsOnly) setShowFollowedTagsOnly(false);
          }}
          followingTags={followingTags}
          onToggleFollowTag={handleToggleFollowTag}
          showFollowedTagsOnly={showFollowedTagsOnly}
          onToggleShowFollowedTagsOnly={() => {
            setShowFollowedTagsOnly(!showFollowedTagsOnly);
            if (selectedTag) setSelectedTag(null);
          }}
        />

        {/* Filters and Sorting Bar */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
          {/* Category Chips with 'Following' tab */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isFollowingTab = cat === 'Following';
              const isSelected = selectedCategory === cat && !showFavoritesOnly;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (showFavoritesOnly) setShowFavoritesOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? isFollowingTab
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {isFollowingTab && <UserCheck className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                  {isFollowingTab && followingCreators.length > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {followingCreators.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort Selector & Reset */}
          <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
                title="Reset all active filters"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer shadow-sm"
              >
                <option value="highest-rated">Highest Rated</option>
                <option value="most-played">Most Played</option>
                <option value="newest">Recently Added</option>
                <option value="alphabetical">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Active Filter Pill Bar (if multiple filters active) */}
        {hasActiveFilters && (
          <section className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-medium">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-medium">
                Tag: #{selectedTag}
                <button
                  onClick={() => setSelectedTag(null)}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {showFollowedTagsOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-medium">
                Followed Tags Only
                <button
                  onClick={() => setShowFollowedTagsOnly(false)}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {showFavoritesOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-medium">
                Favorites Only
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-medium">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-rose-600 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </section>
        )}

        {/* Games Grid */}
        <section>
          {filteredGames.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 mx-auto flex items-center justify-center text-indigo-600 shadow-sm">
                <Gamepad2 className="w-7 h-7" />
              </div>

              {selectedCategory === 'Following' && followingCreators.length === 0 ? (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    You haven't followed any creators yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Click the "Follow" button next to any author on a game card to see their titles here in your personalized Following feed!
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsFollowingModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
                    >
                      Discover & Follow Creators
                    </button>
                  </div>
                </div>
              ) : selectedTag ? (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    No games tagged with #{selectedTag}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Be the pioneer who adds the first #{selectedTag} game to the community arcade!
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Clear #{selectedTag} Tag Filter
                    </button>
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publish #{selectedTag} Game</span>
                    </button>
                  </div>
                </div>
              ) : games.length === 0 ? (
                <div>
                  <h3 className="text-base font-bold text-slate-900">No games in the arcade yet</h3>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                    Submit your HTML5 or JavaScript game code to launch the community hub!
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm mx-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publish Your First Game</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-bold text-slate-900">No games matched your criteria</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your search terms or clearing tag filters.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-3">
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Submit a Game</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={favorites.includes(game.id)}
                  onPlay={handlePlayGame}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenReviews={handleOpenReviews}
                  onDeleteGame={handleDeleteGame}
                  isFollowingAuthor={followingCreators.includes(game.author)}
                  onToggleFollowAuthor={handleToggleFollowCreator}
                  onOpenCreatorProfile={(author) => setActiveCreatorModal(author)}
                  onSelectTag={(tag) => setSelectedTag(tag)}
                  followerCount={creatorFollowersMap[game.author] || 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Community Arcade Hub</span>
            <span>·</span>
            <span>All games run in sandboxed client environments</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFollowingModalOpen(true)}
              className="hover:text-indigo-600 transition flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              <span>Following ({followingCreators.length} creators, {followingTags.length} tags)</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="hover:text-indigo-600 transition"
            >
              Submit Game
            </button>
            <span>·</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-indigo-600 transition"
            >
              Gamer ID & Google Link
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GamePlayerModal
        game={activeGame}
        isOpen={!!activeGame}
        onClose={() => setActiveGame(null)}
        reviews={activeGame ? reviewsMap[activeGame.id] || [] : []}
        profile={userProfile}
        isFavorite={activeGame ? favorites.includes(activeGame.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddReview={handleAddReview}
        onVoteHelpful={handleVoteHelpful}
        onQuickRate={handleQuickRate}
        onDeleteGame={handleDeleteGame}
        isFollowingAuthor={activeGame ? followingCreators.includes(activeGame.author) : false}
        onToggleFollowAuthor={handleToggleFollowCreator}
        onOpenCreatorProfile={(author) => setActiveCreatorModal(author)}
        onSelectTag={(tag) => {
          setSelectedTag(tag);
          setActiveGame(null);
        }}
        followerCount={activeGame ? creatorFollowersMap[activeGame.author] || 0 : 0}
      />

      <CreatorProfileModal
        isOpen={!!activeCreatorModal}
        onClose={() => setActiveCreatorModal(null)}
        creatorName={activeCreatorModal}
        games={games}
        isFollowing={activeCreatorModal ? followingCreators.includes(activeCreatorModal) : false}
        followerCount={activeCreatorModal ? creatorFollowersMap[activeCreatorModal] || 0 : 0}
        onToggleFollow={handleToggleFollowCreator}
        onPlayGame={(game) => {
          setActiveCreatorModal(null);
          handlePlayGame(game);
        }}
        onSelectTag={(tag) => {
          setSelectedTag(tag);
          setActiveCreatorModal(null);
        }}
      />

      <FollowingModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        followingCreators={followingCreators}
        followingTags={followingTags}
        creatorFollowersMap={creatorFollowersMap}
        games={games}
        onToggleFollowCreator={handleToggleFollowCreator}
        onToggleFollowTag={handleToggleFollowTag}
        onOpenCreatorProfile={(creator) => {
          setIsFollowingModalOpen(false);
          setActiveCreatorModal(creator);
        }}
        onSelectTag={(tag) => {
          setIsFollowingModalOpen(false);
          setSelectedTag(tag);
        }}
      />

      <GameSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitGame={handlePublishGame}
        profile={userProfile}
      />

      <GoogleProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={{
          ...userProfile,
          followingCreators,
          followingTags
        }}
        onUpdateProfile={setUserProfile}
        onOpenFollowingModal={() => setIsFollowingModalOpen(true)}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
