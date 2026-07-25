import { Review } from "../models/review";
class ReviewAdapters{
    toModel(data:any):Review{
        return{
            rating:data.rating,
            comment:data.comment,
            date:data.date,
            reviewerName:data.reviewerName
        };
    }
    sortByNewest(reviews:Review[]){
        return reviews.sort(
            (a,b)=> new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );
    }
}
export default new ReviewAdapters();