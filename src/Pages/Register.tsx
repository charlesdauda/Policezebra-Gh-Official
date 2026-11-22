import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

const Register = () => (
  <AuthLayout title="Create account" subtitle="Join Police Zebra in a minute.">
    <RegisterForm />
  </AuthLayout>
);

export default Register;