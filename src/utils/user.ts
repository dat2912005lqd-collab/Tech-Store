import {
    User
} from "../models/user";
export const UserUtil={
    fullName(user:User)
    {
        return `${user.firstName}${user.lastName}`
    },
    isAdmin(user:User)
    {
        return user.role==="admin";
    }
};