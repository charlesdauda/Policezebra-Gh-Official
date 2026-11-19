import { Link, useParams } from "react-router-dom";
import { PRODUCT_BY_ID } from "../data/products";
import ProductDetail from "../components/ProductDetail";

const ProductPage = () => {
  const { id = "" } = useParams();
  const product = PRODUCT_BY_ID[id];

  if (!product) {
    return (
      <section className="flex min-h-[60svh] items-center justify-center px-5 py-16">
        <div className="flex max-w-md flex-col items-center text-center">
          <h1 className="text-[26px] font-semibold uppercase leading-none text-(--black) sm:text-[32px]">
            Product not found
          </h1>
          <p className="mt-3 text-base text-(--grey)">
            We couldn't find that product. It may have been removed.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-13 items-center justify-center rounded-md bg-(--navy) px-8 text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors hover:bg-[#061a33]"
          >
            Back to shop
          </Link>
        </div>
      </section>
    );
  }

  // key resets the colour and size choices when you open a different product
  return <ProductDetail key={product.id} product={product} />;
};

export default ProductPage;