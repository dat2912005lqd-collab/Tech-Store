

export interface ReviewData {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt?: string;
  isLocalDemo?: boolean;
}

interface ReviewCardProps {
  review: ReviewData;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const safeRating = Math.max(0, Math.min(5, Math.round(review.rating || 0)));
  const stars = Array.from({ length: 5 }, (_, index) => (index < safeRating ? '★' : '☆'));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-900">{review.author}</h4>
          <p className="text-sm text-slate-500">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
          </p>
        </div>

        {review.isLocalDemo && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
            Local demo
          </span>
        )}
      </div>

      <div className="mt-3 text-sm text-yellow-600">{stars.join(' ')}</div>

      <p className="mt-3 leading-6 text-slate-600">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;