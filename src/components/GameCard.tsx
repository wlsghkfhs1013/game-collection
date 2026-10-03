import React from 'react';
import { Star, Play, Heart, Users, Gamepad2, Rocket, Zap, Boxes, Brain, Trophy, Trash2, UserPlus, UserCheck } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onPlay: (game: Game) => void;
  onToggleFavorite: (gameId: string) => void;
  onOpenReviews: (game: Game) => void;
  onDeleteGame?: (gameId: string) => void;
  isFollowingAuthor?: boolean;
  onToggleFollowAuthor?: (authorName: string) => void;
  onOpenCreatorProfile?: (authorName: string) => void;
  onSelectTag?: (tag: string) => void;
  followerCount?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onOpenReviews,
  onDeleteGame,
  isFollowingAuthor = false,
  onToggleFollowAuthor,
  onOpenCreatorProfile,
  onSelectTag,
  followerCount = 0
}) => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Rocket':
        return <Rocket className="w-8 h-8 text-white/95" />;
      case 'Zap':
        return <Zap className="w-8 h-8 text-white/95" />;
      case 'Boxes':
        return <Boxes className="w-8 h-8 text-white/95" />;
      case 'Brain':
        return <Brain className="w-8 h-8 text-white/95" />;
      case 'Trophy':
        return <Trophy className="w-8 h-8 text-white/95" />;
      default:
        return <Gamepad2 className="w-8 h-8 text-white/95" />;
    }
  };

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    game.author
  )}`;

  return (
    <div
      id={`game-card-${game.id}`}
      className="group rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden shadow-sm"
    >
      {/* Thumbnail Banner */}
      <div
        className={`relative w-full h-44 bg-gradient-to-tr ${game.thumbnailGradient} flex items-center justify-center overflow-hidden cursor-pointer`}
        onClick={() => onPlay(game)}
      >
        {/* Background glow & subtle patterns */}
        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            {renderIcon(game.iconName)}
          </div>
        </div>

        {/* Hover "Play" badge */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-3.5 h-3.5 fill-slate-900" />
            Play Directly
          </span>
        </div>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-indigo-700 border border-white/40 shadow-sm">
          {game.category}
        </span>

        {/* Action Buttons: Favorite & Delete */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {onDeleteGame && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete "${game.title}" from the arcade?`)) {
                  onDeleteGame(game.id);
                }
              }}
              className="p-2 rounded-lg bg-white/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-white/40 backdrop-blur-md transition shadow-sm"
              title="Delete this game"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-md transition shadow-sm ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-white/40'
            }`}
            title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header Title */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onPlay(game)}
              className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {game.title}
            </h3>
          </div>

          {/* Author info & Follow button */}
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <div
              onClick={() => onOpenCreatorProfile && onOpenCreatorProfile(game.author)}
              className="flex items-center gap-1.5 cursor-pointer group/author min-w-0"
              title="View creator profile"
            >
              <img
                src={avatarUrl}
                alt=""
                className="w-5 h-5 rounded-full border border-slate-200 bg-slate-100 object-cover shrink-0"
              />
              <span className="text-xs text-slate-600 group-hover/author:text-indigo-600 font-medium truncate">
                by {game.author}
              </span>
            </div>

            {/* Follow Creator Action */}
            {onToggleFollowAuthor && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollowAuthor(game.author);
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition shrink-0 ${
                  isFollowingAuthor
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200'
                }`}
                title={isFollowingAuthor ? `Unfollow ${game.author}` : `Follow ${game.author}`}
              >
                {isFollowingAuthor ? (
                  <>
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>+ Follow</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {game.description}
          </p>

          {/* Interactive Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {game.tags.slice(0, 4).map((tag, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag && onSelectTag(tag);
                }}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200/80 font-medium transition cursor-pointer"
                title={`Filter by #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Card Footer: Rating, Plays, and Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          {/* Rating */}
          <button
            onClick={() => onOpenReviews(game)}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition text-slate-700 group/rate"
            title="View Ratings & Reviews"
          >
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-400 group-hover/rate:underline">
              ({game.ratingsCount})
            </span>
          </button>

          {/* Plays Count */}
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{game.playCount.toLocaleString()} plays</span>
          </div>

          {/* Play CTA Button */}
          <button
            onClick={() => onPlay(game)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition active:scale-95 ml-auto"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};
