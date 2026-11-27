import tee1 from "../assets/images/products/tee1.png";
import babari from "../assets/images/products/babari.png";
import barbariprint from "../assets/images/products/barbariprint.png";
import unisexhoodie from "../assets/images/products/unisexhoodie.png";
import jacket from "../assets/images/products/jacket.png";
import pants from "../assets/images/products/pants.png";
import flips1 from "../assets/images/products/flips1.png";
import flips2 from "../assets/images/products/flips2.png";
import slippers from "../assets/images/products/slippers.png";
import short1 from "../assets/images/products/short1.png";
import beach from "../assets/images/products/beach.webp";
import socks1 from "../assets/images/products/socks1.png";
import socks2 from "../assets/images/products/socks2.png";
import menbox1 from "../assets/images/products/menbox1.webp";
import menbox2 from "../assets/images/products/menbox2.webp";
import menbox3 from "../assets/images/products/menbox3.webp";
import lacoste1 from "../assets/images/products/lacoste1.png";
import lacoste2 from "../assets/images/products/lacoste2.webp";
import productCatalogue from "../../shared/products.json";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  brand: string;
  category: string;
  name: string;
  description: string;
  ghs: number;
  eur: number;
  oldGhs?: number;
  badge?: string;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
}

export interface Category {
  id: string;
  label: string;
  products: Product[];
}

interface CatalogueProduct {
  id: string;
  brand: string;
  category: string;
  name: string;
  description: string;
  priceGhs: number;
  oldPriceGhs?: number;
  badge?: string;
  imageId: string;
  galleryImageIds: string[];
  colors: string[];
  sizes: string[];
  active: boolean;
}

interface CatalogueCategory {
  id: string;
  label: string;
  products: CatalogueProduct[];
}

interface ProductCatalogue {
  colorOptions: ProductColor[];
  categories: CatalogueCategory[];
}

const catalogue: ProductCatalogue = productCatalogue;
const EUR_RATE = 0.07;

const PRODUCT_IMAGES: Record<string, string> = {
  tee1,
  babari,
  barbariprint,
  unisexhoodie,
  jacket,
  pants,
  flips1,
  flips2,
  slippers,
  short1,
  beach,
  socks1,
  socks2,
  menbox1,
  menbox2,
  menbox3,
  lacoste1,
  lacoste2,
};

const colorByName = new Map(
  catalogue.colorOptions.map((color) => [color.name, color])
);

const resolveImage = (imageId: string): string => {
  const image = PRODUCT_IMAGES[imageId];
  if (!image) throw new Error(`Unknown product image identifier: ${imageId}`);
  return image;
};

const resolveColor = (name: string): ProductColor => {
  const color = colorByName.get(name);
  if (!color) throw new Error(`Unknown product color: ${name}`);
  return color;
};

const toProduct = (entry: CatalogueProduct): Product => ({
  id: entry.id,
  brand: entry.brand,
  category: entry.category,
  name: entry.name,
  description: entry.description,
  ghs: entry.priceGhs,
  eur: Math.round(entry.priceGhs * EUR_RATE),
  ...(entry.oldPriceGhs !== undefined ? { oldGhs: entry.oldPriceGhs } : {}),
  ...(entry.badge !== undefined ? { badge: entry.badge } : {}),
  image: resolveImage(entry.imageId),
  gallery: entry.galleryImageIds.map(resolveImage),
  colors: entry.colors.map(resolveColor),
  sizes: entry.sizes,
});

export const CATEGORIES: Category[] = catalogue.categories.map((category) => ({
  id: category.id,
  label: category.label,
  products: category.products.filter((product) => product.active).map(toProduct),
}));

export const ALL_PRODUCTS: Product[] = [
  ...new Map(
    CATEGORIES.flatMap((category) => category.products).map((product) => [
      product.id,
      product,
    ])
  ).values(),
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  ALL_PRODUCTS.map((product) => [product.id, product])
);

export const POPULAR_IDS = [
  "zebra-classic-tee",
  "essential-hoodie",
  "relaxed-denim-shorts",
  "Barbari-print-tee",
  "everyday-flipflops",
  "everyday-slippers",
];

export const ghsFmt = (n: number) =>
  `GH₵${n.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const eurFmt = (n: number) =>
  `€${n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
