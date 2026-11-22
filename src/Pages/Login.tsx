import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

const Login = () => (
  <AuthLayout title="Sign in" subtitle="Welcome back. Sign in with your email or phone number.">
    <LoginForm />
  </AuthLayout>
);

export default Login;