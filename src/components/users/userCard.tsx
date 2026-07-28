

interface UserCardProps{
    user:{
        id:string;
        name:string;
        email:string;
        role?:string;
    };
}
const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-1 text-sm text-blue-600">{user.role||'User'}</p>
        </div>
    );
};
export default UserCard;