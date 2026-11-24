import { useState } from "react";
import { Link } from "react-router-dom";
import { eurFmt, ghsFmt, type Product } from "../data/products";
import { cartKey } from "../context/cartContext";
import { useCart } from "../context/useCart";
import AddedToCartModal from "./AddedToCartModal";

const ProductDetail = ({ product }: { product: Product }) => {
  const { addItem, lines } = useCart();

  const [color, setColor] = useState("");
  const [size, setSize] = useState(
    product.sizes.length === 1 ? product.sizes[0] : ""
  );
  const [added, setAdded] = useState<{ color: string; size: string } | null>(null);
  const canAdd = Boolean(color && size);

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product.id, color, size);
    setAdded({ color, size });
  };

  const addedLine = added
    ? lines.find((l) => l.key === cartKey(product.id, added.color, added.size))
    : undefined;

  return (
    <section className="pb-16 pt-6 sm:pb-20 sm:pt-10 lg:pb-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[14px] text-(--grey)">
            <li>
              <Link to="/shop" className="transition-colors hover:text-(--navy)">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop" className="transition-colors hover:text-(--navy)">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-(--black)">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Main product image */}
          <div>
            <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-lg border border-(--border) bg-(--ivory) lg:mx-0">
              <img
                src={product.image}
                alt={product.name}
                className="size-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-4 top-4 bg-(--white) px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-(--black)">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="max-w-xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-(--grey)">
              {product.category}
            </p>
            <h1 className="mt-2 text-[30px] font-semibold leading-tight text-(--black) sm:text-[40px]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[26px] font-semibold text-(--navy) sm:text-[30px]">
                {ghsFmt(product.ghs)}
              </p>
              {product.oldGhs && (
                <p className="text-[16px] text-(--grey) line-through">
                  {ghsFmt(product.oldGhs)}
                </p>
              )}
              <p className="text-[15px] text-(--grey)">{eurFmt(product.eur)}</p>
            </div>

            <div className="mt-6 border-t border-(--border) pt-6">
              <p className="text-[17px] leading-normal text-(--grey)">
                {product.description}
              </p>
              <p className="mt-5 flex items-center gap-2 text-[15px] font-medium text-(--grey)">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                In stock
              </p>
            </div>

            {/* Colour */}
            <div className="mt-8">
              <p className="text-[15px] font-semibold text-(--black)">
                Color
                {color && (
                  <>
                    : <span className="font-normal text-(--grey)">{color}</span>
                  </>
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={color === c.name}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`size-9 cursor-pointer rounded-full border border-(--border) transition-shadow ${
                      color === c.name
                        ? "ring-2 ring-(--navy) ring-offset-2"
                        : "hover:ring-2 hover:ring-(--navy)/30 hover:ring-offset-2"
                    }`}
                  />
                ))}
              </div>
              {!color && (
                <p className="mt-3 text-[13px] text-(--grey)">
                  Please select a color before adding to cart.
                </p>
              )}
            </div>

            {/* Size */}
            <div className="mt-8">
              <p className="text-[15px] font-semibold text-(--black)">Size</p>
              <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Size">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => setSize(s)}
                    className={`h-12 min-w-14 cursor-pointer rounded-md border px-4 text-[15px] font-medium transition-colors ${
                      size === s
                        ? "border-(--navy) bg-(--navy) text-(--white)"
                        : "border-(--border) bg-(--white) text-(--black) hover:border-(--navy)"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!size && (
                <p className="mt-3 text-[13px] text-(--grey)">
                  Please select a size before adding to cart.
                </p>
              )}
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className="mt-8 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-(--navy) text-[15px] font-semibold uppercase tracking-[0.06em] text-(--white) transition-colors duration-200 hover:bg-[#061a33] disabled:cursor-not-allowed disabled:bg-(--navy)/35 disabled:hover:bg-(--navy)/35"
            >
              <i className="ri-shopping-bag-3-line text-xl" aria-hidden="true" />
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {added && addedLine && (
        <AddedToCartModal line={addedLine} onClose={() => setAdded(null)} />
      )}
    </section>
  );
};

export default ProductDetail;