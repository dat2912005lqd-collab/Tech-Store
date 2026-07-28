
import './Login.css';
import LoginForm from './LoginForm';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-heading">Tech Store</h1>
        <p className="login-subtitle">Đăng nhập để tiếp tục</p>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;