interface Props{
    rating:number;
}
function Rating(
    {
        rating
    }:Props){
        return(
            <span>
                {rating.toFixed(1)}
            </span>
        );
    }
export default Rating;