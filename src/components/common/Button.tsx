import "./Button.css";
interface ButtonProps{
    children:React.ReactNode;
    type?:"button"|"submit";
    variant?:"primary"|"secondary"|"danger";
    onClick?:()=>void;
    disabled?:boolean;
}
function Button({
    children,
    type="button",
    variant="primary",
    onClick,
    disabled=false
}:ButtonProps){
    return (
        <button
            type={type}
            className={`btn btn-${variant}`}
            disabled={disabled}
            onClick={onClick}
        >
            children
        </button>
    );
}
export default Button;
