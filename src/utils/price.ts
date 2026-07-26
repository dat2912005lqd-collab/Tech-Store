export const PriceUtil={
    discount(
        price:number,
        percent:number
    ){
        return Number(
            (
                price-price*percent/100
            ).toFixed(2)
        );
    },
    format(
        price:number
    ){
        return new Intl.NumberFormat(
            "vi-VN",
            {
                style:"currency", currency:"VND"
            }
        ).format(price);
    }
};