import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
const RegisterForm = () => {
    const navigate = useNavigate();
    const [form,setForm]=useState({
        fullname:"",
        email:"",
        password:"",
        confirmPassword:""
    });
    const [error,setError]=useState("");
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    };
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        if(form.password!==form.confirmPassword){
            setError("Password does not match");
            return;
        }
        try{
            await register({
                fullname:form.fullname,
                email:form.email,
                password:form.password,});
            }
            catch(err)
            {
            setError("Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
};

export default RegisterForm;