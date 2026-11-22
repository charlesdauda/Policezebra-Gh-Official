import AuthLayout from "../components/AuthLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword = () => (
  <AuthLayout title="New password" subtitle="Choose a new password for your account.">
    <ResetPasswordForm />
  </AuthLayout>
);

export default ResetPassword;