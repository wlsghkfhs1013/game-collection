import React, { useState } from 'react';
import { X, Users, UserCheck, Star, Trash2, Tag, ArrowRight, Gamepad2, Sparkles, UserPlus } from 'lucide-react';
import { Game } from '../types';

interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  followingCreators: string[];
  followingTags: string[];
  creatorFollowersMap: Record<string, number>;
  games: Game[];
  onToggleFollowCreator: (name: string) => void;
  onToggleFollowTag: (tag: string) => void;
  onOpenCreatorProfile: (name: string) => void;
  onSelectTag: (tag: string) => void;
}

export const FollowingModal: React.FC<FollowingModalProps> = ({
  isOpen,
  onClose,
  followingCreators,
  followingTags,
  creatorFollowersMap,
  games,
  onToggleFollowCreator,
  onToggleFollowTag,
  onOpenCreatorProfile,
  onSelectTag
}) => {
  const [activeTab, setActiveTab] = useState<'creators' | 'tags'>('creators');

  if (!isOpen) return null;

  // Extract all distinct authors from games
  const allAuthors = Array.from(new Set(games.map((g) => g.author)));

  // Suggested authors not yet followed
  const suggestedAuthors = allAuthors.filter(
    (author) => !followingCreators.includes(author)
  );

  // Suggested tags not yet followed
  const allTags = Array.from(new Set(games.flatMap((g) => g.tags)));
  const suggestedTags = allTags
    .filter((t) => !followingTags.includes(t.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Followed Stuff</h2>
              <p className="text-xs text-slate-500">
                Manage arcade creators and tags you are following
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('creators')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'creators'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Creators ({followingCreators.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tags')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'tags'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Tags ({followingTags.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {activeTab === 'creators' ? (
            <div>
              {followingCreators.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mx-auto">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">No creators followed yet</h3>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                      Follow your favorite developers to easily find their new games and updates right from your feed!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {followingCreators.map((creator) => {
                    const creatorGames = games.filter(
                      (g) => g.author.toLowerCase() === creator.toLowerCase()
                    );
                    const followerCount = creatorFollowersMap[creator] || 1;
                    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                      creator
                    )}`;

                    return (
                      <div
                        key={creator}
                        className="p-3 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition flex items-center justify-between gap-3"
                      >
                        <div
                          onClick={() => {
                            onOpenCreatorProfile(creator);
                            onClose();
                          }}
                          className="flex items-center gap-3 cursor-pointer min-w-0"
                        >
                          <img
                            src={avatarUrl}
                            alt=""
                            className="w-10 h-10 rounded-xl bg-slate-100 object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition truncate">
                              {creator}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span>{creatorGames.length} games</span>
                              <span>·</span>
                              <span>{followerCount.toLocaleString()} followers</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              onOpenCreatorProfile(creator);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onToggleFollowCreator(creator)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Unfollow Creator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Suggested creators */}
              {suggestedAuthors.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Discover Arcade Creators</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {suggestedAuthors.map((author) => {
                      const count = games.filter(
                        (g) => g.author.toLowerCase() === author.toLowerCase()
                      ).length;
                      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                        author
                      )}`;

                      return (
                        <div
                          key={author}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">
                                {author}
                              </h5>
                              <p className="text-[10px] text-slate-500">{count} games</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onToggleFollowCreator(author)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-xs shrink-0 transition"
                          >
                            + Follow
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {followingTags.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">No tags followed yet</h3>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                      Click the star icon next to any tag in the Popular Tags cloud to follow your favorite genres!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {followingTags.map((tag) => {
                    const matchingCount = games.filter((g) =>
                      g.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
                    ).length;

                    return (
                      <div
                        key={tag}
                        className="p-3 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              #{tag}
                            </span>
                            <p className="text-[11px] text-slate-500">
                              {matchingCount} game{matchingCount === 1 ? '' : 's'} available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onSelectTag(tag);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition flex items-center gap-1"
                          >
                            <span>Filter Games</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onToggleFollowTag(tag)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Unfollow Tag"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Suggested Tags to follow */}
              {suggestedTags.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Popular Arcade Tags to Follow</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => onToggleFollowTag(tag.toLowerCase())}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-xs text-slate-700 font-medium transition"
                      >
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>#{tag}</span>
                        <span className="text-[10px] text-slate-400">+ Follow</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
