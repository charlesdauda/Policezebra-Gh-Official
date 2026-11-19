import PageHeader from "../components/PageHeader";
import CheckoutForm from "../components/CheckoutForm";

const Checkout = () => {
  return (
    <>
      <PageHeader
        eyebrow="Step 2 of 2"
        title="checkout"
        description="Tell us where to deliver and we will take care of the rest."
        crumb="Checkout"
      />
      <CheckoutForm />
    </>
  );
};

export default Checkout;