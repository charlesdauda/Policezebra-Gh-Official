import AuthLayout from "../components/AuthLayout";
import OtpVerify from "../components/OtpVerify";

const VerifyOtp = () => (
  <AuthLayout
    title="Verify your account"
    subtitle="Enter the 6-digit code we sent to your phone number."
  >
    <OtpVerify />
  </AuthLayout>
);

export default VerifyOtp;