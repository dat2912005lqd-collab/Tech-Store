import { create } from "zustand";
import { Review } from "../models/review";
interface ReviewState{
    reviews:Review[];
    setReviews:(
        reviews: Review[]
    )=>void;
    addReview:(
        review:Review
    )=>void;
}
export const useReviewStore= create<ReviewState>(
    (set, get)=>({
        reviews:[],
        setReviews:(reviews)=>
            set({
                reviews
            }),
        addReview:(review)=>
           set({
                reviews: [
                    review,
                    ...get().reviews
                ]
            })
    })
)