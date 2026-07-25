import {NavigateFunction} from "react-router-dom";
export const goHome=(
    navigate:NavigateFunction
)=>{
    navigate("/");
};
export const goProducts=(
    navigate:NavigateFunction
)=>{
    navigate("/products");
};
export const goCart=(
    navigate:NavigateFunction
)=>
{
    navigate("/cart");
};
export const goProfile=(
    navigate:NavigateFunction
)=>{
    navigate("/profile");
}
export const goBack=(
    navigate:NavigateFunction
)=>
{
    navigate(-1);
}


