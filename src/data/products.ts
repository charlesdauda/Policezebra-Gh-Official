import tee1 from "../assets/images/products/tee1.png"; 
import tee2 from "../assets/images/products/babari.png";
import tee3 from "../assets/images/products/barbariprint.png";

import hoodie1 from "../assets/images/products/unisexhoodie.png";
import jacket from "../assets/images/products/jacket.png"
import pants from "../assets/images/products/pants.png"

import flips1 from "../assets/images/products/flips1.png";
import flips2 from "../assets/images/products/flips2.png"
import slipper1 from "../assets/images/products/slippers.png"; 

import shorts1 from "../assets/images/products/short1.png"
import shorts2 from "../assets/images/products/beach.webp";

import socks1 from "../assets/images/products/socks1.png";
import socks2 from "../assets/images/products/socks2.png"; 

import boxer1 from "../assets/images/products/menbox1.webp";
import boxer2 from "../assets/images/products/menbox2.webp";
import boxer3 from "../assets/images/products/menbox3.webp";

import lacoste1 from "../assets/images/products/lacoste1.png";
import lacoste2 from "../assets/images/products/lacoste2.webp";

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

const EUR_RATE = 0.07;

const COLORS: ProductColor[] = [
  { name: "Navy", hex: "#0B294D" },
  { name: "Black", hex: "#080808" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#8A8A8A" },
  { name: "Cream", hex: "#F4EBD0" },
  { name: "Champagne", hex: "#B9A98A" },
];

const SHOE_SIZES = ["37", "38", "39", "40", "41", "42", "43"];
const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];
const SOCK_SIZES = ["S/M", "L/XL"];
const ONE_SIZE = ["One size"];

const SIZES_BY_CATEGORY: Record<string, string[]> = {
  Flipflops: SHOE_SIZES,
  Slippers: SHOE_SIZES,
  Socks: SOCK_SIZES,
  Aprons: ONE_SIZE,
  Mugs: ONE_SIZE,
};

const item = (
  category: string,
  id: string,
  name: string,
  description: string,
  ghs: number,
  image: string,
  extra: { oldGhs?: number; badge?: string; gallery?: string[] } = {}
): Product => {
  const { gallery, ...rest } = extra;
  return {
    id,
    brand: "Police Zebra",
    category,
    name,
    description,
    ghs,
    eur: Math.round(ghs * EUR_RATE),
    image,
    gallery: gallery?.length ? [image, ...gallery] : [image, image, image, image],
    colors: COLORS,
    sizes: SIZES_BY_CATEGORY[category] ?? CLOTHING_SIZES,
    ...rest,
  };
};

export const CATEGORIES: Category[] = [
  {
    id: "t-shirts",
    label: "T-shirts",
    products: [
      item("T-shirts", "zebra-classic-tee", "Zebra classic tee", "Heavy cotton with the signature zebra print.", 120, tee1, { badge: "Trending" }),
      item("T-shirts", "Barbari-printed-tee", "Barbari printed tee", "Authentic cotton with barbari print.", 130, tee2),
      item("T-Shirts", "Barbari-printed-tee-logo", "Barbari print tee with logo", "Very sleek and authentic", 130, tee3)
    ],
  },

  {
    id: "hoodies",
    label: "Hoodies",
    products: [
      item("Hoodies", "essential-hoodie", "Essential unisex hoodie", "Sleek cotton, made to be shared.", 280, hoodie1, { badge: "Bestseller" }),
      item("Hoodies", "essential-hoodie-jacket", "Hoodie jacket", "Sleek cotton, made to be shared", 280, jacket ),
      item("Hoodies", "essential-hoodie-pants", "Hoodie Pants", "Sleek cotton, made to be shared", 280, pants)
    ],
  },

  {
    id: "flipflops",
    label: "Flipflops",
    products: [
      item("Flipflops", "everyday-flipflops", "Everyday flipflops", "Lightweight everyday footwear.", 130, flips1),
      item("Flipflops", "classic-flipflops", "Classic flipflops", "Lightweight everyday footwear.", 130, flips2)
    ],
  },

  {
    id: "slippers",
    label: "Slippers",
    products: [
      item("Slippers", "everyday-slippers", "Everyday slippers", "Soft, comfortable indoor footwear.", 150, slipper1),
    ],
  },
  {
    id: "shorts",
    label: "Shorts",
    products: [
      item("Shorts", "relaxed-denim-shorts", "Relaxed denim shorts", "Washed denim with a loose, easy fit.", 160, shorts1, { oldGhs: 200 }),
      item("Shorts", "weekend-shorts", "Weekend shorts", "Breathable cotton with an elastic waist.", 150, shorts2),
    ],
  },

  {
    id: "boxers",
    label: "Boxers",
    products: [
      item("Boxers", "Police 1983 Men Boxer", "Police 1983 Men Boxer", "Premium cotton boxer brief with elastic waistband.", 55, boxer1),
      item("Boxers", "Police Max", "Police Max", "Pack of 3 premium boxers in assorted colors.", 65, boxer2, { badge: "New" }),
      item("Boxers", "Police Platinum Boxer", "Police Platinum Boxer", "Pack of 3 premium boxers in assorted colors.", 99, boxer3)
    ],
  },

  {
    id: "lacoste",
    label: "Lacoste",
    products: [
      item("Lacoste", "Authentic Police Lacoste", "Authentic Police Lacoste", "Smart everyday polo with a clean collar.", 220, lacoste1),
      item("Lacoste", "Premium Police Lacoste", "Premium Police Lacoste", "Soft pique fabric with a polished finish.", 260, lacoste2, { badge: "New" }),
    ],
  },

  {
    id: "socks",
    label: "Socks",
    products: [
      item("Socks", "striped-sport-socks", "Stripes sport socks", "Soft cotton blend in classic colours.", 60, socks1),
      item("Socks", "crew-socks-3-pack" , "Crew Socks", "Cushioned heel and arch support", 45, socks2),
    ],
  },
];
export const ALL_PRODUCTS: Product[] = [
  ...new Map(
    CATEGORIES.flatMap((c) => c.products).map((product) => [product.id, product])
  ).values(),
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  ALL_PRODUCTS.map((p) => [p.id, p])
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