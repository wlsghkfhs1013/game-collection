import React, { useState, useMemo } from 'react';
import { Flame, Tag, Star, X, Check, Search, Filter } from 'lucide-react';
import { Game } from '../types';

interface PopularTagsCloudProps {
  games: Game[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  followingTags: string[];
  onToggleFollowTag: (tag: string) => void;
  showFollowedTagsOnly: boolean;
  onToggleShowFollowedTagsOnly: () => void;
}

// Curated popular community tags to always provide discovery even with new installs
const CURATED_COMMUNITY_TAGS = [
  'arcade',
  'retro',
  'action',
  'puzzle',
  'pixelart',
  'physics',
  'speedrun',
  'dodge',
  'space',
  'neon',
  'jump',
  'relaxing',
  'canvas',
  '2d',
  'casual',
  'sci-fi',
  'cyberpunk',
  'clicker'
];

export const PopularTagsCloud: React.FC<PopularTagsCloudProps> = ({
  games,
  selectedTag,
  onSelectTag,
  followingTags,
  onToggleFollowTag,
  showFollowedTagsOnly,
  onToggleShowFollowedTagsOnly
}) => {
  const [tagSearch, setTagSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute tag frequencies from all games + blend with curated tags
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};

    // Count from actual games
    games.forEach((game) => {
      game.tags.forEach((t) => {
        const normalized = t.toLowerCase().trim();
        if (normalized) {
          counts[normalized] = (counts[normalized] || 0) + 1;
        }
      });
    });

    // Ensure curated tags exist with at least game count (or 0 if not present)
    CURATED_COMMUNITY_TAGS.forEach((tag) => {
      if (counts[tag] === undefined) {
        counts[tag] = 0;
      }
    });

    // Convert to sorted array
    const sorted = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        isFollowed: followingTags.includes(name)
      }))
      .sort((a, b) => {
        // Prioritize: actual game count first, then followed tags, then alphabetical
        if (b.count !== a.count) return b.count - a.count;
        if (a.isFollowed && !b.isFollowed) return -1;
        if (!a.isFollowed && b.isFollowed) return 1;
        return a.name.localeCompare(b.name);
      });

    return sorted;
  }, [games, followingTags]);

  // Filtered tags based on search
  const visibleTags = useMemo(() => {
    let list = tagStats;
    if (tagSearch.trim()) {
      const q = tagSearch.toLowerCase().trim();
      list = list.filter((t) => t.name.includes(q));
    }
    return isExpanded ? list : list.slice(0, 16);
  }, [tagStats, tagSearch, isExpanded]);

  // Calculate font size / prominence styling based on count/popularity
  const maxCount = Math.max(1, ...tagStats.map((t) => t.count));
  const getTagWeightStyle = (count: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 border-transparent font-bold scale-[1.03] ring-2 ring-indigo-400/50';
    }

    const ratio = count / maxCount;
    if (ratio >= 0.7 && count > 0) {
      return 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200/90 font-bold shadow-xs';
    } else if (ratio >= 0.3 && count > 0) {
      return 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-semibold';
    }
    return 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80 font-medium';
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Popular Tags
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Tag Cloud
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Filter arcade games by tag or follow topics you love
            </p>
          </div>
        </div>

        {/* Quick actions: Search tag & Followed Tags shortcut */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Followed Tags Filter Button */}
          <button
            onClick={onToggleShowFollowedTagsOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-xs ${
              showFollowedTagsOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Show games matching tags you follow"
          >
            <Star className={`w-3.5 h-3.5 ${showFollowedTagsOnly ? 'fill-white' : 'text-amber-500'}`} />
            <span>Followed Tags</span>
            {followingTags.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showFollowedTagsOnly ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {followingTags.length}
              </span>
            )}
          </button>

          {/* Quick Tag Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search tags..."
              className="bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition w-32 sm:w-40"
            />
            {tagSearch && (
              <button
                onClick={() => setTagSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Notice (if tag is active) */}
      {selectedTag && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              Filtering games by: <b className="font-bold">#{selectedTag}</b>
            </span>
            <span className="text-[11px] text-indigo-600 font-medium">
              ({games.filter((g) => g.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())).length} games found)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Follow/Unfollow this tag */}
            <button
              onClick={() => onToggleFollowTag(selectedTag)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                followingTags.includes(selectedTag)
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <Star
                className={`w-3 h-3 ${
                  followingTags.includes(selectedTag) ? 'fill-amber-500 text-amber-500' : 'text-indigo-500'
                }`}
              />
              <span>{followingTags.includes(selectedTag) ? 'Following Tag' : 'Follow Tag'}</span>
            </button>

            {/* Clear filter */}
            <button
              onClick={() => onSelectTag(null)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-indigo-100 text-slate-700 hover:text-indigo-900 font-semibold transition border border-indigo-200/80"
              title="Clear tag filter"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Tag Cloud Pills Container */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Reset / All Tag button */}
        <button
          onClick={() => {
            onSelectTag(null);
            if (showFollowedTagsOnly) onToggleShowFollowedTagsOnly();
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border transition ${
            selectedTag === null && !showFollowedTagsOnly
              ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200/80 font-medium'
          }`}
        >
          <Tag className="w-3 h-3" />
          <span>All Tags</span>
        </button>

        {visibleTags.map((t) => {
          const isSelected = selectedTag?.toLowerCase() === t.name.toLowerCase();
          const weightClasses = getTagWeightStyle(t.count, isSelected);

          return (
            <div
              key={t.name}
              className={`group inline-flex items-center rounded-xl border text-xs transition duration-200 ${weightClasses}`}
            >
              {/* Tag button to filter */}
              <button
                onClick={() => onSelectTag(isSelected ? null : t.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 focus:outline-none"
                title={`Filter by #${t.name} (${t.count} game${t.count === 1 ? '' : 's'})`}
              >
                <span>#{t.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : t.count > 0
                      ? 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {t.count}
                </span>
              </button>

              {/* Follow Tag Star Icon Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollowTag(t.name);
                }}
                className={`pr-2.5 pl-0.5 py-1.5 transition ${
                  isSelected ? 'hover:text-amber-200' : 'hover:text-amber-500'
                }`}
                title={t.isFollowed ? `Unfollow #${t.name}` : `Follow #${t.name}`}
              >
                <Star
                  className={`w-3.5 h-3.5 transition ${
                    t.isFollowed
                      ? isSelected
                        ? 'fill-amber-300 text-amber-300'
                        : 'fill-amber-400 text-amber-500'
                      : isSelected
                      ? 'text-white/60 hover:text-white'
                      : 'text-slate-300 group-hover:text-slate-400 hover:text-amber-500'
                  }`}
                />
              </button>
            </div>
          );
        })}

        {/* Expand / Collapse toggle if there are many tags */}
        {tagStats.length > 16 && !tagSearch && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 transition"
          >
            {isExpanded ? 'Show fewer tags' : `+${tagStats.length - 16} more tags...`}
          </button>
        )}
      </div>
    </section>
  );
};
