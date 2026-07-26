import { User } from "../models/user";
import { CommonValidation } from "./commonValidation";
export const UserValidation={
    validate(user:User):string[]{
        const errors:string[]=[];
        if(!CommonValidation.required(user.firstName)){
            errors.push("First name is required");
        }
        if(!CommonValidation.required(user.lastName)){
            errors.push("Last name is required");
        }
        if(!CommonValidation.email(user.email)){
            errors.push("Invalid email");
        }
        return errors;
    }
}