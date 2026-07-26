import React from 'react';
import { useEffect } from "react";
import userService from "../services/userService";
import { useUserStore } from "../store/userStore";

export const useUsers=()=>{
    const{
        users, setUsers
    }=useUserStore();
    
    useEffect(()=>{
        userService.getAll()
        .then((res)=> setUsers(res.users));
    },[]);
    
    return{
        users
    };
};