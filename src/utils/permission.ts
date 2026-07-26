export const Permission={
    canEdit(role:string){
        return role==="admin";
    },
    canDelete(role:string){
        return role==="admin";
    }
};