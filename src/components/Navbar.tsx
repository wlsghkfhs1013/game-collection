import React from 'react';
import { Gamepad2, Plus, Heart, Search, User, ShieldCheck, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  followingCount: number;
  onOpenFollowingModal: () => void;
  onOpenSubmitModal: () => void;
  profile: UserProfile;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  followingCount,
  onOpenFollowingModal,
  onOpenSubmitModal,
  profile,
  onOpenProfileModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 transition shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Community Arcade</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Hub
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">Play, Rate & Share Everyone's Games</p>
            </div>
          </div>

          {/* Mobile Right Quick Action: Google ID */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenFollowingModal}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition relative text-xs font-semibold"
              title="Followed Creators & Tags"
            >
              <UserCheck className="w-4 h-4 text-slate-600" />
              {followingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {followingCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenProfileModal}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Your Gamer ID & Google Account"
            >
              {profile.googleAvatarUrl ? (
                <img src={profile.googleAvatarUrl} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            id="nav-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games, authors, or tags (e.g. #space, #retro)..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Following Hub Button */}
          <button
            onClick={onOpenFollowingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shrink-0"
            title="Manage followed creators and tags"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Following</span>
            {followingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-[10px] text-indigo-700 font-bold">
                {followingCount}
              </span>
            )}
          </button>

          {/* Favorites Filter */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shrink-0 ${
              showFavoritesOnly
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Google ID Profile Button */}
          <button
            id="btn-google-profile"
            onClick={onOpenProfileModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shrink-0 ${
              profile.isGoogleLinked
                ? 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200 text-indigo-900 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400 shadow-sm'
            }`}
            title={profile.isGoogleLinked ? 'Google Linked Gamer ID' : 'Link Gamer ID to Google'}
          >
            {/* Google G Logo icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-medium truncate max-w-[110px]">
              {profile.isGoogleLinked ? profile.gamerTag : 'Link Google ID'}
            </span>
            {profile.isGoogleLinked && (
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            )}
          </button>

          {/* Submit a game */}
          <button
            id="btn-publish-game"
            onClick={onOpenSubmitModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
