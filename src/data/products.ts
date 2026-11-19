// Placeholder image for every product (swap per product later)
import essentialsImg from "../assets/images/essentials.png";

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
  image: string;
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
const WAIST_SIZES = ["28", "30", "32", "34", "36"];
const SOCK_SIZES = ["S/M", "L/XL"];
const ONE_SIZE = ["One size"];

// Sizes per category (anything not listed uses clothing sizes)
const SIZES_BY_CATEGORY: Record<string, string[]> = {
  Sneakers: SHOE_SIZES,
  Slides: SHOE_SIZES,
  "Jeans & trousers": WAIST_SIZES,
  Jorts: WAIST_SIZES,
  Socks: SOCK_SIZES,
  Caps: ONE_SIZE,
  Backpacks: ONE_SIZE,
  "Duffel bags": ONE_SIZE,
};

const item = (
  category: string,
  id: string,
  name: string,
  description: string,
  ghs: number,
  extra: { oldGhs?: number; badge?: string } = {}
): Product => ({
  id,
  brand: "Police Zebra",
  category,
  name,
  description,
  ghs,
  eur: Math.round(ghs * EUR_RATE),
  image: essentialsImg,
  colors: COLORS,
  sizes: SIZES_BY_CATEGORY[category] ?? CLOTHING_SIZES,
  ...extra,
});

/* ======================================================================
   CATEGORIES AND PRODUCTS
   Each category block contains only that category's products.
   To add a product, copy a line inside the right category.
   To add a category, copy a whole block and give it a new id and label.
   Product ids must be unique (the cart and checkout will use them).
   ====================================================================== */
export const CATEGORIES: Category[] = [
  /* ---------- JEANS & TROUSERS ---------- */
  {
    id: "jeans-trousers",
    label: "Jeans & trousers",
    products: [
      item("Jeans & trousers", "straight-leg-jeans", "Straight leg jeans", "Classic fit in washed indigo denim.", 320),
      item("Jeans & trousers", "relaxed-chinos", "Relaxed chinos", "Soft cotton twill with an easy cut.", 280),
      item("Jeans & trousers", "weekend-jogger", "Weekend jogger", "Soft brushed cotton with a tapered leg.", 210),
    ],
  },

  /* ---------- SNEAKERS ---------- */
  {
    id: "sneakers",
    label: "Sneakers",
    products: [
      item("Sneakers", "court-low-sneaker", "Court low sneaker", "Clean leather upper for everyday wear.", 450),
      item("Sneakers", "zebra-runner", "Zebra runner", "Light cushioned sole with a bold finish.", 520),
    ],
  },

  /* ---------- GRAPHIC TEES ---------- */
  {
    id: "graphic-tees",
    label: "Graphic tees",
    products: [
      item("Graphic tees", "zebra-classic-tee", "Zebra classic tee", "Heavy cotton with the signature zebra print.", 120, { badge: "Trending" }),
      item("Graphic tees", "oversized-navy-tee", "Oversized navy tee", "Relaxed drop shoulder fit.", 130),
    ],
  },

  /* ---------- HOODIES & JACKETS ---------- */
  {
    id: "hoodies-jackets",
    label: "Hoodies & jackets",
    products: [
      item("Hoodies & jackets", "essential-hoodie", "Essential unisex hoodie", "Brushed fleece lining, made to be shared.", 280, { badge: "Bestseller" }),
      item("Hoodies & jackets", "coach-jacket", "Coach jacket", "Lightweight layer with snap buttons.", 360),
    ],
  },

  /* ---------- SHORTS ---------- */
  {
    id: "shorts",
    label: "Shorts",
    products: [
      item("Shorts", "relaxed-denim-shorts", "Relaxed denim shorts", "Washed denim with a loose, easy fit.", 160, { oldGhs: 200 }),
      item("Shorts", "weekend-shorts", "Weekend shorts", "Breathable cotton with an elastic waist.", 150),
      item("Shorts", "track-shorts", "Track shorts", "Quick dry fabric for active days.", 140),
    ],
  },

  /* ---------- JORTS ---------- */
  {
    id: "jorts",
    label: "Jorts",
    products: [
      item("Jorts", "relaxed-denim-jorts", "Relaxed denim jorts", "Knee length with a loose fit.", 190),
      item("Jorts", "faded-black-jorts", "Faded black jorts", "Washed black denim, worn in feel.", 200),
    ],
  },

  /* ---------- CAPS ---------- */
  {
    id: "caps",
    label: "Caps",
    products: [
      item("Caps", "everyday-cap", "Everyday cap", "Six panel cotton cap, adjustable strap.", 90, { badge: "New" }),
      item("Caps", "zebra-dad-cap", "Zebra dad cap", "Curved brim with embroidered logo.", 100),
    ],
  },

  /* ---------- SOCKS ---------- */
  {
    id: "socks",
    label: "Socks",
    products: [
      item("Socks", "crew-socks-3-pack", "Crew socks, 3 pack", "Soft cotton blend in classic colours.", 60),
      item("Socks", "striped-sport-socks", "Striped sport socks", "Cushioned heel and arch support.", 45),
    ],
  },

  /* ---------- SLIDES ---------- */
  {
    id: "slides",
    label: "Slides",
    products: [
      item("Slides", "cloud-slides", "Cloud slides", "Soft foam footbed, easy to slip on.", 130),
      item("Slides", "zebra-logo-slides", "Zebra logo slides", "Waterproof strap with a raised logo.", 150),
    ],
  },

  /* ---------- BACKPACKS ---------- */
  {
    id: "backpacks",
    label: "Backpacks",
    products: [
      item("Backpacks", "city-backpack", "City backpack", "Padded laptop sleeve and two pockets.", 340),
      item("Backpacks", "mini-backpack", "Mini backpack", "Compact size for everyday essentials.", 240),
    ],
  },

  /* ---------- DUFFEL BAGS ---------- */
  {
    id: "duffel-bags",
    label: "Duffel bags",
    products: [
      item("Duffel bags", "weekender-duffel", "Weekender duffel", "Roomy canvas bag with a shoulder strap.", 380),
      item("Duffel bags", "gym-duffel", "Gym duffel", "Water resistant with a shoe compartment.", 320),
    ],
  },
];

/* ---------- Shared helpers (shop, home page, and later cart and checkout) ---------- */

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
  "everyday-cap",
  "weekend-jogger",
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