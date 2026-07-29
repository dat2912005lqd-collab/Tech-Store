

interface UserFilterProps{
    value:string;
    onChange:(value:string)=>void;
}

const UserFilter=({value, onChange}:UserFilterProps)=>(
    <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Tìm người dùng..."
    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
  />
);
export default UserFilter;
