import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, User, LogOut, Sparkles, ExternalLink, RefreshCw, Users, Star, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface GoogleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenFollowingModal?: () => void;
}

export const GoogleProfileModal: React.FC<GoogleProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenFollowingModal
}) => {
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [newTag, setNewTag] = useState(profile.gamerTag);
  const [customEmail, setCustomEmail] = useState(profile.googleEmail || 'hb2610502@ggm.goe.go.kr');
  const [customName, setCustomName] = useState(profile.googleName || 'Gamer Hub');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickGoogleLink = () => {
    setIsConnecting(true);
    setFeedback(null);

    setTimeout(() => {
      const emailToUse = customEmail.trim() || 'hb2610502@ggm.goe.go.kr';
      const nameToUse = customName.trim() || emailToUse.split('@')[0];
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailToUse)}`;

      const updated: UserProfile = {
        ...profile,
        isGoogleLinked: true,
        googleEmail: emailToUse,
        googleName: nameToUse,
        googleAvatarUrl: avatarUrl,
        linkedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      onUpdateProfile(updated);
      setIsConnecting(false);
      setFeedback('Google account linked successfully!');
      setTimeout(() => setFeedback(null), 2500);
    }, 600);
  };

  const handleUnlink = () => {
    const updated: UserProfile = {
      ...profile,
      isGoogleLinked: false,
      googleEmail: undefined,
      googleName: undefined,
      googleAvatarUrl: undefined,
      linkedAt: undefined
    };
    onUpdateProfile(updated);
    setFeedback('Google account unlinked.');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleSaveTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    onUpdateProfile({
      ...profile,
      gamerTag: newTag.trim()
    });
    setIsEditingTag(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Gamer Identity & Google Link</h2>
              <p className="text-xs text-slate-500">Manage your player ID, badge and verified status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Notification feedback */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Player Identity Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              {profile.googleAvatarUrl ? (
                <img
                  src={profile.googleAvatarUrl}
                  alt={profile.gamerTag}
                  className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-md bg-white p-0.5 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  {profile.gamerTag.slice(0, 2).toUpperCase()}
                </div>
              )}
              {profile.isGoogleLinked && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center"
                  title="Google Account Verified"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-slate-900 text-base">{profile.gamerTag}</span>
                {profile.isGoogleLinked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    Google Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                    Guest Account
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-slate-500 font-mono">
                <span>ID: {profile.id}</span>
                <span>·</span>
                <button
                  onClick={() => setIsEditingTag(!isEditingTag)}
                  className="text-indigo-600 hover:text-indigo-800 underline font-sans text-xs"
                >
                  {isEditingTag ? 'Cancel' : 'Change Tag'}
                </button>
              </div>

              {profile.isGoogleLinked && profile.googleEmail && (
                <p className="text-xs text-slate-600 mt-1 truncate">
                  Linked to: <span className="font-medium text-slate-800">{profile.googleEmail}</span>
                </p>
              )}
            </div>
          </div>

          {/* Edit Gamer Tag Form */}
          {isEditingTag && (
            <form onSubmit={handleSaveTag} className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Set Gamer Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. PixelHero"
                  maxLength={20}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Followed Creators & Tags Stats */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{profile.followingCreators?.length || 0} Creators Followed</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{profile.followingTags?.length || 0} Tags Followed</span>
              </div>
            </div>

            {onOpenFollowingModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFollowingModal();
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Google Link Status Section */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Google Multi-Color G Icon */}
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                </div>
                <h3 className="text-sm font-bold text-slate-800">Google Account Connection</h3>
              </div>
              {profile.isGoogleLinked ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Connected
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Not Linked
                </span>
              )}
            </div>

            {profile.isGoogleLinked ? (
              <div className="space-y-3 pt-1">
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Google User:</span>
                    <span className="font-semibold text-slate-800">{profile.googleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-medium text-slate-800">{profile.googleEmail}</span>
                  </div>
                  {profile.linkedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Linked On:</span>
                      <span className="text-slate-700">{profile.linkedAt}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Your Google identity verifies your reviews, gives you a Google Gamer badge, and links your submitted games to your ID.
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleUnlink}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg font-medium transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Unlink Google Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Link your Arcade ID to your Google account to get verified, preserve your reviews, and showcase your published games with a verified badge.
                </p>

                {/* Direct 1-Click Link Button */}
                <button
                  onClick={handleQuickGoogleLink}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs shadow-sm hover:shadow transition active:scale-[0.99] disabled:opacity-70"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>
                    {isConnecting ? 'Linking with Google...' : `Sign in & Link with Google (${customEmail})`}
                  </span>
                </button>

                {/* Option to specify different Google Account email */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 underline block text-center w-full"
                  >
                    {showManualInput ? 'Hide Account Details' : 'Use a different Google account or name'}
                  </button>

                  {showManualInput && (
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Google Email Address
                        </label>
                        <input
                          type="email"
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. Alex"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
