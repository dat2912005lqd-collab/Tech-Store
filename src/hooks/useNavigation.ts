import { useNavigate} from "react-router-dom";
import * as Navigation from "../utils/navigation";
export const useNavigation=()=>{
    const navigate=useNavigate();
    return {
        goHome:()=>Navigation.goHome(navigate),
        goProducts:()=>Navigation.goProducts(navigate),
        goCart:()=>Navigation.goCart(navigate),
        goProfile:()=>Navigation.goProfile(navigate),
        goBack:()=>Navigation.goBack(navigate)
    };
};