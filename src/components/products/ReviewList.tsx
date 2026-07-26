import React from 'react';

interface Review {
  id: string;
  author: string;
  comment: string;
  rating?: number;
}

const ReviewList = ({ reviews }: { reviews: Review[] }) => (
  <div className="space-y-3">
    {reviews.length === 0 ? (
      <p className="text-sm text-slate-500">Chưa có đánh giá.</p>
    ) : (
      reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{r.author}</h4>
            <span className="text-sm text-yellow-600">{r.rating ?? 0}/5</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
        </div>
      ))
    )}
  </div>
);

export default ReviewList;