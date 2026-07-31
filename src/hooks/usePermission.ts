import {useMemo} from "react";
import { useAuthStore } from "@/store/authStore";
export class UsePermission{
    constructor(private roles:string[]=[]){

    }
    hasRole(role:string):boolean{
        return this.roles.includes(role);
    }
    isAdmin():boolean{
        return this.hasRole("admin");
    }
    isUser():boolean{
        return this.hasRole("user");
    }
}
export default function usePermission() {
  const user = useAuthStore((state) => state.user);
  return useMemo(() => {
    const roles =
      user?.role
        ? [user?.role.toLowerCase()]
        : [];
    return new UsePermission(roles);
  }, [user]);
}