/* ---------- Graphic tees ---------- */
import tee1 from "../assets/images/essentials.png"; // Zebra classic tee
import tee2 from "../assets/images/essentials.png"; // Oversized navy tee

/* ---------- Hoodies ---------- */
import hoodie1 from "../assets/images/essentials.png"; // Essential unisex hoodie

/* ---------- Shorts ---------- */
import shorts1 from "../assets/images/essentials.png"; // Relaxed denim shorts
import shorts2 from "../assets/images/essentials.png"; // Weekend shorts
import shorts3 from "../assets/images/essentials.png"; // Track shorts

/* ---------- Socks ---------- */
import socks1 from "../assets/images/essentials.png"; // Crew socks, 3 pack
import socks2 from "../assets/images/essentials.png"; // Striped sport socks

/* ---------- Flipflops and slippers ---------- */
import flipflop1 from "../assets/images/essentials.png"; // Flipflop
import slipper1 from "../assets/images/essentials.png"; // Slipper

/* ---------- Boxers and underpants ---------- */
import boxer1 from "../assets/images/essentials.png";
import boxer2 from "../assets/images/essentials.png";
import underpant1 from "../assets/images/essentials.png";
import underpant2 from "../assets/images/essentials.png";

/* ---------- Lacoste ---------- */
import lacoste1 from "../assets/images/essentials.png";
import lacoste2 from "../assets/images/dunmis.png";

/* ---------- Aprons ---------- */
import apron1 from "../assets/images/apron.png";
import apron2 from "../assets/images/apron.png";

/* ---------- Mugs ---------- */
import mug1 from "../assets/images/mug.png";
import mug2 from "../assets/images/mug.png";

/* ---------- Tote bags ---------- */
import tote1 from "../assets/images/tote.png";
import tote2 from "../assets/images/tote.png";

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
  ghs: number; // main price (Ghana cedis)
  eur: number; // euro price (change per product whenever you like)
  oldGhs?: number; // optional crossed-out price
  badge?: string; // optional label, e.g. "New"
  image: string; // main photo
  gallery: string[]; // main photo first, then any extra photos
  colors: ProductColor[]; // colours shown on the product page
  sizes: string[]; // sizes shown on the product page
}

export interface Category {
  id: string;
  label: string;
  products: Product[];
}

// TODO: placeholder exchange rate, used only to fill the euro prices below.
// Overwrite the `eur` value on any product when you have real prices.
const EUR_RATE = 0.07;

// Colours offered on every product for now (edit per product later)
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

// Sizes per category (anything not listed uses clothing sizes)
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
    // With real extra photos: main photo + those photos.
    // Without any yet: the main photo is repeated 4 times as a placeholder.
    gallery: gallery?.length ? [image, ...gallery] : [image, image, image, image],
    colors: COLORS,
    sizes: SIZES_BY_CATEGORY[category] ?? CLOTHING_SIZES,
    ...rest,
  };
};

/* ======================================================================
   CATEGORIES AND PRODUCTS
   Each category block contains only that category's products.
   To add a product: add an import above, then copy a line inside the
   right category and use your new image variable.
   To add a category, copy a whole block and give it a new id and label.
   Product ids must be unique (the cart and checkout use them).
   ====================================================================== */
export const CATEGORIES: Category[] = [
  /* ---------- T-SHIRTS ---------- */
  {
    id: "t-shirts",
    label: "T-shirts",
    products: [
      item("T-shirts", "zebra-classic-tee", "Zebra classic tee", "Heavy cotton with the signature zebra print.", 120, tee1, { badge: "Trending" }),
      item("T-shirts", "oversized-navy-tee", "Oversized navy tee", "Relaxed drop shoulder fit.", 130, tee2),
    ],
  },

  /* ---------- HOODIES ---------- */
  {
    id: "hoodies",
    label: "Hoodies",
    products: [
      item("Hoodies", "essential-hoodie", "Essential unisex hoodie", "Brushed fleece lining, made to be shared.", 280, hoodie1, { badge: "Bestseller" }),
    ],
  },

  /* ---------- FLIPFLOPS ---------- */
  {
    id: "flipflops",
    label: "Flipflops",
    products: [
      item("Flipflops", "everyday-flipflops", "Everyday flipflops", "Lightweight everyday footwear.", 130, flipflop1),
    ],
  },

  /* ---------- SLIPPERS ---------- */
  {
    id: "slippers",
    label: "Slippers",
    products: [
      item("Slippers", "everyday-slippers", "Everyday slippers", "Soft, comfortable indoor footwear.", 150, slipper1),
    ],
  },

  /* ---------- SHORTS ---------- */
  {
    id: "shorts",
    label: "Shorts",
    products: [
      item("Shorts", "relaxed-denim-shorts", "Relaxed denim shorts", "Washed denim with a loose, easy fit.", 160, shorts1, { oldGhs: 200 }),
      item("Shorts", "weekend-shorts", "Weekend shorts", "Breathable cotton with an elastic waist.", 150, shorts2),
      item("Shorts", "track-shorts", "Track shorts", "Quick dry fabric for active days.", 140, shorts3),
    ],
  },

  /* ---------- BOXERS ---------- */
  {
    id: "boxers",
    label: "Boxers",
    products: [
      item("Boxers", "classic-cotton-boxers", "Classic cotton boxers", "Soft breathable cotton for all-day comfort.", 55, boxer1),
      item("Boxers", "police-zebra-boxers", "Police Zebra boxers", "Comfort-fit boxer with a bold branded finish.", 65, boxer2, { badge: "New" }),
    ],
  },

  /* ---------- LACOSTE ---------- */
  {
    id: "lacoste",
    label: "Lacoste",
    products: [
      item("Lacoste", "classic-lacoste-polo", "Classic Lacoste polo", "Smart everyday polo with a clean collar.", 220, lacoste1),
      item("Lacoste", "premium-lacoste-polo", "Premium Lacoste polo", "Soft pique fabric with a polished finish.", 260, lacoste2, { badge: "New" }),
    ],
  },

  /* ---------- SOCKS ---------- */
  {
    id: "socks",
    label: "Socks",
    products: [
      item("Socks", "crew-socks-3-pack", "Crew socks, 3 pack", "Soft cotton blend in classic colours.", 60, socks1),
      item("Socks", "striped-sport-socks", "Striped sport socks", "Cushioned heel and arch support.", 45, socks2),
    ],
  },

  /* ---------- UNDERPANTS ---------- */
  {
    id: "underpants",
    label: "Underpants",
    products: [
      item("Underpants", "classic-cotton-underpants", "Classic cotton underpants", "Comfortable everyday fit in soft cotton.", 45, underpant1),
      item("Underpants", "premium-underpants", "Premium underpants", "Stretch fabric with a supportive waistband.", 55, underpant2),
    ],
  },

  /* ---------- APRONS ---------- */
  {
    id: "aprons",
    label: "Aprons",
    products: [
      item("Aprons", "police-zebra-apron", "Police Zebra apron", "Durable apron for cooking, baking or work.", 110, apron1),
      item("Aprons", "branded-kitchen-apron", "Branded kitchen apron", "Adjustable apron with a practical front pocket.", 120, apron2, { badge: "New" }),
    ],
  },

  /* ---------- MUGS ---------- */
  {
    id: "mugs",
    label: "Mugs",
    products: [
      item("Mugs", "police-zebra-mug", "Police Zebra mug", "Ceramic mug for hot drinks at home or work.", 70, mug1),
      item("Mugs", "branded-zebra-mug", "Branded zebra mug", "Bold branded mug with a comfortable handle.", 80, mug2, { badge: "New" }),
    ],
  },

  /* ---------- TOTE BAGS ---------- */
  {
    id: "tote-bags",
    label: "Tote bags",
    products: [
      item("Tote bags", "police-zebra-tote", "Police Zebra tote bag", "Roomy everyday tote for shopping, school or work.", 95, tote1),
      item("Tote bags", "branded-zebra-tote", "Branded zebra tote bag", "Reusable canvas tote with a bold zebra finish.", 110, tote2, { badge: "New" }),
    ],
  },
];

/* ---------- Shared helpers (shop, home page, cart and checkout) ---------- */

// Every product in one list (the order here is treated as "newest")
export const ALL_PRODUCTS: Product[] = CATEGORIES.flatMap((c) => c.products);

// Look up one product by id, e.g. PRODUCT_BY_ID["essential-hoodie"]
export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  ALL_PRODUCTS.map((p) => [p.id, p])
);

// Products shown in "Popular right now" on the home page, in this order
export const POPULAR_IDS = [
  "zebra-classic-tee",
  "essential-hoodie",
  "relaxed-denim-shorts",
  "oversized-navy-tee",
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