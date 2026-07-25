import { User } from "../models/user";
class UserAdapter{
    toModel(data:any):User{
        return {
            id:data.id,
            firstName:data.firstName,
            lastName:data.lastName,
            email:data.email,
            username:data.username,
            image:data.image,
            role:data.role
        };
    }
    toDTO(user:User)
    {
        return{
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email
        };
    }
    getFullName(user:User):string{
        return `${user.firstName} ${user.lastName}`;
    }
} 
export default new UserAdapter();