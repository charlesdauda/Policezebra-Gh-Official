import AuthLayout from "../components/AuthLayout";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

const ForgotPassword = () => (
  <AuthLayout
    title="Forgot password"
    subtitle="Enter your email and we will send you a link to reset it."
  >
    <ForgotPasswordForm />
  </AuthLayout>
);

export default ForgotPassword;