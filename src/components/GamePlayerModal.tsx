import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, HelpCircle, Heart, Share2, Star, Check, Gamepad2, Trash2, UserPlus, UserCheck, Tag } from 'lucide-react';
import { Game, Review, UserProfile } from '../types';
import { RatingBreakdown } from './RatingBreakdown';
import { ReviewList } from './ReviewList';

interface GamePlayerModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  profile: UserProfile;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onAddReview: (review: Omit<Review, 'id' | 'gameId' | 'date' | 'helpfulVotes'>) => void;
  onVoteHelpful: (reviewId: string) => void;
  onQuickRate: (gameId: string, rating: number) => void;
  onDeleteGame?: (gameId: string) => void;
  isFollowingAuthor?: boolean;
  onToggleFollowAuthor?: (authorName: string) => void;
  onOpenCreatorProfile?: (authorName: string) => void;
  onSelectTag?: (tag: string) => void;
  followerCount?: number;
}

export const GamePlayerModal: React.FC<GamePlayerModalProps> = ({
  game,
  isOpen,
  onClose,
  reviews,
  profile,
  isFavorite,
  onToggleFavorite,
  onAddReview,
  onVoteHelpful,
  onQuickRate,
  onDeleteGame,
  isFollowingAuthor = false,
  onToggleFollowAuthor,
  onOpenCreatorProfile,
  onSelectTag,
  followerCount = 0
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeTab, setActiveTab] = useState<'play' | 'reviews'>('play');
  const [userRating, setUserRating] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game) {
      setIframeKey((prev) => prev + 1);
      setUserRating(null);
    }
  }, [game?.id]);

  if (!isOpen || !game) return null;

  const handleRestart = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleRatingClick = (stars: number) => {
    setUserRating(stars);
    onQuickRate(game.id, stars);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    game.author
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div
        ref={containerRef}
        className="w-full max-w-5xl rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto max-h-[96vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.thumbnailGradient} flex items-center justify-center text-white shrink-0 shadow-sm`}
            >
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 truncate">{game.title}</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                  {game.category}
                </span>
              </div>

              {/* Author & Follow Pill */}
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  onClick={() => onOpenCreatorProfile && onOpenCreatorProfile(game.author)}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition group/author"
                  title="View creator profile"
                >
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-4 h-4 rounded-full border border-slate-200 bg-slate-100 object-cover"
                  />
                  <span className="text-xs text-slate-500 group-hover/author:text-indigo-600 font-medium">
                    by {game.author}
                  </span>
                </div>

                {onToggleFollowAuthor && (
                  <button
                    onClick={() => onToggleFollowAuthor(game.author)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                      isFollowingAuthor
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-white text-slate-600 hover:text-indigo-600 border border-slate-200 hover:bg-indigo-50'
                    }`}
                    title={isFollowingAuthor ? `Unfollow ${game.author}` : `Follow ${game.author}`}
                  >
                    {isFollowingAuthor ? (
                      <>
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        <span>Following ({followerCount})</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow ({followerCount})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Favorite */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-lg border transition ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Restart game */}
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Toggle instructions */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`p-2 rounded-lg border transition ${
                showHelp
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Controls & Instructions"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
              title="Copy link to game"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Delete Game */}
            {onDeleteGame && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${game.title}" from the arcade?`)) {
                    onDeleteGame(game.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-lg bg-white hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-slate-400 hover:text-rose-600 transition"
                title="Delete this game"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-500 transition ml-1"
              title="Exit Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instructions Banner (Collapsible) */}
        {showHelp && (
          <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100 text-xs text-indigo-900 flex items-start justify-between gap-4 animate-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <span className="font-bold text-indigo-950 text-xs uppercase tracking-wider">How to Play:</span>
              <p className="text-indigo-800">{game.instructions}</p>
              {/* Tags */}
              <div className="flex items-center gap-1.5 pt-1">
                <Tag className="w-3 h-3 text-indigo-500" />
                <span className="text-[11px] font-semibold text-indigo-900">Tags:</span>
                {game.tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      if (onSelectTag) {
                        onSelectTag(t);
                        onClose();
                      }
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition font-medium"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="text-indigo-400 hover:text-indigo-700 shrink-0 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View mode switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('play')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'play'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Play Arcade Screen
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Ratings & Reviews</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-[10px] text-slate-700 font-semibold">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'play' ? (
            <div className="flex flex-col">
              {/* Game Sandbox Iframe */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] max-h-[62vh] min-h-[380px] bg-slate-950 relative flex items-center justify-center">
                <iframe
                  key={iframeKey}
                  title={game.title}
                  srcDoc={game.code}
                  sandbox="allow-scripts allow-modals allow-same-origin allow-pointer-lock"
                  className="w-full h-full border-0 block"
                />
              </div>

              {/* Player Bottom Bar & Quick Rating */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                {/* Game Quick Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{game.title}</span>
                    <span className="text-slate-500">· {game.playCount.toLocaleString()} plays</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 max-w-xl">{game.description}</p>
                </div>

                {/* Quick 1-Click Star Rating Bar */}
                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-semibold text-slate-700 text-xs">
                    {userRating ? 'Your Rating:' : 'Rate this Game:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className="p-0.5 hover:scale-125 transition"
                        title={`Rate ${star} Stars`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= (userRating || Math.round(game.rating))
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating && (
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>
              </div>

              {/* Embedded Reviews section immediately beneath the player */}
              <div className="p-4 sm:p-6 bg-white border-t border-slate-200 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Game Ratings & Community Feedback
                  </h3>
                  <RatingBreakdown
                    rating={game.rating}
                    ratingsCount={game.ratingsCount}
                    distribution={game.ratingDistribution}
                  />
                </div>

                <ReviewList
                  gameId={game.id}
                  gameTitle={game.title}
                  reviews={reviews}
                  profile={profile}
                  onAddReview={onAddReview}
                  onVoteHelpful={onVoteHelpful}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6 max-w-3xl mx-auto">
              <RatingBreakdown
                rating={game.rating}
                ratingsCount={game.ratingsCount}
                distribution={game.ratingDistribution}
              />

              <ReviewList
                gameId={game.id}
                gameTitle={game.title}
                reviews={reviews}
                profile={profile}
                onAddReview={onAddReview}
                onVoteHelpful={onVoteHelpful}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
