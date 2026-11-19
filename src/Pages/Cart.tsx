import PageHeader from "../components/PageHeader";
import CartView from "../components/CartView";

const Cart = () => {
  return (
    <>
      <PageHeader
        eyebrow="Your bag"
        outline="your"
        title="cart"
        description="Review the items you have picked before you check out."
        crumb="Cart"
      />
      <CartView />
    </>
  );
};

export default Cart;