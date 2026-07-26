import { CommonValidation } from "./commonValidation";

export const AuthValidation={
    validateLogin(
        username:string,
        password:string
    ): string[]{
        const errors:string[]=[];
        if (!CommonValidation.required(username)){
            errors.push("Username is required");
        }
        if (!CommonValidation.required(password)){
            errors.push("Password is required");
        }
        if (!CommonValidation.minLength(password,6)){
            errors.push("Password must be at least 6 characters");
        }
        return errors;
    }
}