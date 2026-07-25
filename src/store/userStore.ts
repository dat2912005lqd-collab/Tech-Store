import { create } from "zustand";
import { User } from "../models/user";
import userAdapter from "../adapters/userAdapter";
interface UserState{
    users:User[];
    selectedUser?:User;
    setUsers:(
        users:User[]
    )=>void;
    setSelectedUser:(
        user:User
    )=>void;
    clear:()=>void;
}
export const useUserStore=create<UserStore>(
    (set)=>({
        users:[],
        setUsers:(users)=>
            set({users}),
        setSelectedUser:(selectedUser)=>
            set({selectedUser}),
        clear:()=>
            set({
                users:[], sellectedUser:undefined
            })
    })
);