import React from 'react';
import { Star } from 'lucide-react';

interface RatingBreakdownProps {
  rating: number;
  ratingsCount: number;
  distribution: { [star: number]: number };
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  rating,
  ratingsCount,
  distribution
}) => {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-6">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center sm:border-r sm:border-slate-200 sm:pr-6 shrink-0">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {rating.toFixed(1)}
        </div>
        <div className="flex items-center gap-1 my-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(rating)
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-slate-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'}
        </span>
      </div>

      {/* Distribution Bars */}
      <div className="w-full space-y-1.5 flex-1">
        {stars.map((starNum) => {
          const count = distribution[starNum] || 0;
          const percentage = ratingsCount > 0 ? (count / ratingsCount) * 100 : 0;
          return (
            <div key={starNum} className="flex items-center gap-2.5 text-xs text-slate-600">
              <span className="w-3 text-right font-semibold text-slate-700">{starNum}</span>
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-slate-400 text-[11px]">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
