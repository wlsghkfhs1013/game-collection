import React from 'react';
import { X, UserPlus, UserCheck, Users, Gamepad2, Play, Star, Sparkles } from 'lucide-react';
import { Game } from '../types';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string | null;
  games: Game[];
  isFollowing: boolean;
  followerCount: number;
  onToggleFollow: (creatorName: string) => void;
  onPlayGame: (game: Game) => void;
  onSelectTag: (tag: string) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  games,
  isFollowing,
  followerCount,
  onToggleFollow,
  onPlayGame,
  onSelectTag
}) => {
  if (!isOpen || !creatorName) return null;

  const creatorGames = games.filter(
    (g) => g.author.toLowerCase() === creatorName.toLowerCase()
  );
  const totalPlays = creatorGames.reduce((acc, g) => acc + g.playCount, 0);
  const avgRating =
    creatorGames.length > 0
      ? (
          creatorGames.reduce((acc, g) => acc + g.rating, 0) / creatorGames.length
        ).toFixed(1)
      : '5.0';

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    creatorName
  )}`;

  // Find author bio if any game has it
  const authorBio =
    creatorGames.find((g) => g.authorBio)?.authorBio ||
    `Community game creator developing HTML5 and JavaScript browser games for the Community Arcade Hub.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Banner with gradient */}
        <div className="relative h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-4 flex items-start justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Arcade Creator</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and Main Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-indigo-500/20">
                <img
                  src={avatarUrl}
                  alt={creatorName}
                  className="w-full h-full rounded-xl bg-slate-100 object-cover"
                />
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {creatorName}
                </h2>
                <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>{creatorGames.length} Game{creatorGames.length === 1 ? '' : 's'} Published</span>
                </p>
              </div>
            </div>

            {/* Follow / Unfollow CTA */}
            <button
              onClick={() => onToggleFollow(creatorName)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm active:scale-95 ${
                isFollowing
                  ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Creator</span>
                </>
              )}
            </button>
          </div>

          {/* Bio */}
          <p className="text-xs text-slate-600 leading-relaxed mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {authorBio}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] font-medium mb-0.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Followers</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {followerCount.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] font-medium mb-0.5">
                <Play className="w-3.5 h-3.5 text-emerald-500" />
                <span>Total Plays</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {totalPlays.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] font-medium mb-0.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Avg Rating</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {avgRating} ★
              </div>
            </div>
          </div>

          {/* Creator's Games Showcase */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Games by {creatorName}</span>
              <span className="text-[11px] font-semibold text-indigo-600">
                {creatorGames.length} title{creatorGames.length === 1 ? '' : 's'}
              </span>
            </h3>

            {creatorGames.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-slate-50 text-slate-500 text-xs">
                No games published yet by this creator.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {creatorGames.map((game) => (
                  <div
                    key={game.id}
                    className="p-3 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/30 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${game.thumbnailGradient} flex items-center justify-center text-white shrink-0 shadow-sm`}
                      >
                        <Gamepad2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                          {game.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-amber-600">
                            ★ {game.rating.toFixed(1)}
                          </span>
                          <span>·</span>
                          <span>{game.playCount.toLocaleString()} plays</span>
                          <span>·</span>
                          <span className="capitalize">{game.category}</span>
                        </div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {game.tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTag(tag);
                                onClose();
                              }}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onPlayGame(game);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition shrink-0 flex items-center gap-1 active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
