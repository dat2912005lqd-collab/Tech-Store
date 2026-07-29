import { useState } from 'react';
import './Login.css';

type LoginFormValues = {
  username: string;
  password: string;
};

function LoginForm() {
  const [values, setValues] = useState<LoginFormValues>({
    username: '',
    password: '',
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Đăng nhập</h2>

      <label className="login-field">
        <span>Tên đăng nhập</span>
        <input name="username" value={values.username} onChange={handleChange} />
      </label>

      <label className="login-field">
        <span>Mật khẩu</span>
        <input type="password" name="password" value={values.password} onChange={handleChange} />
      </label>

      <button type="submit" className="login-btn">
        Đăng nhập
      </button>
    </form>
  );
}

export default LoginForm;