import React from 'react';
import {
    userOrderStore
} from "../store/orderStore";

export const useOrders=()=>{
    return userOrderStore();
};