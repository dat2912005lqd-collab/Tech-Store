import { create } from "zustand";
import { User } from "../models/user";
import userAdapter from "../adapters/userAdapter";
interface UserStore{
    users:User[];
    selectedUser:any|null;
    setUsers:(
        users:any[]
    )=>void;
    setSelectedUser:(
        user:any
    )=>void;
    clear:()=>void;
}
export const useUserStore=create<UserStore>(
    (set)=>({
        users:[],
        selectedUser:null,
        setUsers:(users:any[])=>
            set({users}),
        setSelectedUser:(selectedUser:any)=>
            set({selectedUser}),
        clear:()=>
            set({
                users:[], selectedUser:undefined
            })
    })
);