import { Review } from "../models/review";
export const ReviewValidation={
    validate(review:Review):string[]{
        const errors:string[]=[];
        if (review.rating<1||review.rating>5){
            errors.push("Rating must be between 1 and 5");
        }
        if (!review.comment.trim()){
            errors.push("Commnent is required");
        }
        return errors;
    }
}