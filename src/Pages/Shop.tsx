import PageHeader from "../components/PageHeader";
import ShopProducts from "../components/ShopProducts";

const Shop = () => {
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        outline="shop"
        title="all"
        description="Browse unisex essentials, menswear and womenswear. Find your fit and make it yours."
        crumb="Shop"
      />
      <ShopProducts />
    </>
  );
};

export default Shop;