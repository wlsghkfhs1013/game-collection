import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquarePlus, CheckCircle2, ChevronDown, ShieldCheck } from 'lucide-react';
import { Review, UserProfile } from '../types';

interface ReviewListProps {
  gameId: string;
  gameTitle: string;
  reviews: Review[];
  profile: UserProfile;
  onAddReview: (review: Omit<Review, 'id' | 'gameId' | 'date' | 'helpfulVotes'>) => void;
  onVoteHelpful: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  gameId,
  gameTitle,
  reviews,
  profile,
  onAddReview,
  onVoteHelpful
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [userName, setUserName] = useState(profile.gamerTag);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [sortBy, setSortBy] = useState<'helpful' | 'newest' | 'highest'>('helpful');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const starLabels: Record<number, string> = {
    1: 'Poor / Buggy',
    2: 'Fair',
    3: 'Good Arcade Fun',
    4: 'Great Game!',
    5: 'Masterpiece 5/5'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = userName.trim() || profile.gamerTag;
    if (!finalName || !reviewComment.trim()) return;

    onAddReview({
      userName: finalName,
      rating: selectedRating,
      title: reviewTitle.trim() || `${selectedRating} Star Review`,
      comment: reviewComment.trim(),
      avatarSeed: finalName,
      userProfileId: profile.id,
      isGoogleVerified: profile.isGoogleLinked
    });

    setReviewTitle('');
    setReviewComment('');
    setSelectedRating(5);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpfulVotes - a.helpfulVotes;
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Community Reviews</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {reviews.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500">Player feedback and verified ratings</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer shadow-sm"
            >
              <option value="helpful">Most Helpful</option>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Write Review Toggle */}
          <button
            id="btn-write-review"
            onClick={() => {
              setUserName(profile.gamerTag);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-slate-50 border border-indigo-200 space-y-3.5 text-xs shadow-md animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-semibold text-slate-900 text-sm">Reviewing: {gameTitle}</span>
            <span className="text-amber-600 font-semibold">
              {starLabels[hoverRating || selectedRating]}
            </span>
          </div>

          {/* User ID & Google Badge indicator */}
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600">Reviewing as:</span>
              <span className="font-bold text-slate-900">{profile.gamerTag}</span>
              {profile.isGoogleLinked ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  Google Verified
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-mono">(ID: {profile.id})</span>
              )}
            </div>
            {profile.isGoogleLinked && profile.googleEmail && (
              <span className="text-[11px] text-slate-500 hidden sm:inline">{profile.googleEmail}</span>
            )}
          </div>

          {/* Star selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Your Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded hover:scale-110 transition focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition ${
                      star <= (hoverRating || selectedRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gamer Tag / Display Name *</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. RetroNinja or Alex"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Review Headline (Optional)</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Addictive high score chaser!"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Your Detailed Review *</label>
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you like? How are the controls, music, and gameplay difficulty?"
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Reviews are stored and linked to your player ID.</span>
            <button
              type="submit"
              disabled={submitSuccess}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-white font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              {submitSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review Published!</span>
                </>
              ) : (
                <span>Post Review</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-8 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600">No reviews yet for this game.</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to play and leave your thoughts!</p>
          </div>
        ) : (
          sortedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                    {rev.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{rev.userName}</span>
                      {rev.isGoogleVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                          Google Verified
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">· {rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Helpful Button */}
                <button
                  onClick={() => onVoteHelpful(rev.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    rev.hasVotedHelpful
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                  title="Mark this review as helpful"
                >
                  <ThumbsUp className={`w-3 h-3 ${rev.hasVotedHelpful ? 'text-indigo-600 fill-indigo-600' : ''}`} />
                  <span>{rev.helpfulVotes}</span>
                </button>
              </div>

              {rev.title && (
                <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
              )}

              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
