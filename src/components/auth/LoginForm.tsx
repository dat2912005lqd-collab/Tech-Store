import React from 'react';
import { useState } from "react";

interface Props{
    onSubmit:(
        username:string,
        password:string
    )=>void
}
function LoginForm({
    onSubmit
}:Props){
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    return(
        <form
            onSubmit={(e)=>{
                e.preventDefault();
                onSubmit(username, password);
            }}
        >
        <input 
laceholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value)
                }
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />
            <button>
                Login
            </button>
        </form>
    );
}
export default LoginForm;
