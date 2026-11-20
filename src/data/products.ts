/* ======================================================================
   PRODUCT IMAGES
   Every product has its own import line. All of them point to the
   placeholder essentials.png for now.
   TO REPLACE AN IMAGE: change only the file path on that product's line,
   e.g.  import sneaker1 from "../assets/images/court-low-sneaker.png";

   EXTRA PHOTOS (optional): add more imports such as
     import sneaker1b from "../assets/images/court-low-sneaker-2.png";
   then pass them in that product's item(...) call at the bottom:
     item(..., 450, sneaker1, { gallery: [sneaker1b] })
   ====================================================================== */

/* ---------- Jeans & trousers ---------- */
import jeans1 from "../assets/images/essentials.png"; // Straight leg jeans
import jeans2 from "../assets/images/essentials.png"; // Relaxed chinos
import jeans3 from "../assets/images/essentials.png"; // Weekend jogger

/* ---------- Sneakers ---------- */
import sneaker1 from "../assets/images/essentials.png"; // Court low sneaker
import sneaker2 from "../assets/images/essentials.png"; // Zebra runner

/* ---------- Graphic tees ---------- */
import tee1 from "../assets/images/essentials.png"; // Zebra classic tee
import tee2 from "../assets/images/essentials.png"; // Oversized navy tee

/* ---------- Hoodies & jackets ---------- */
import hoodie1 from "../assets/images/essentials.png"; // Essential unisex hoodie
import jacket1 from "../assets/images/essentials.png"; // Coach jacket

/* ---------- Shorts ---------- */
import shorts1 from "../assets/images/essentials.png"; // Relaxed denim shorts
import shorts2 from "../assets/images/essentials.png"; // Weekend shorts
import shorts3 from "../assets/images/essentials.png"; // Track shorts

/* ---------- Jorts ---------- */
import jorts1 from "../assets/images/essentials.png"; // Relaxed denim jorts
import jorts2 from "../assets/images/essentials.png"; // Faded black jorts

/* ---------- Caps ---------- */
import cap1 from "../assets/images/essentials.png"; // Everyday cap
import cap2 from "../assets/images/essentials.png"; // Zebra dad cap

/* ---------- Socks ---------- */
import socks1 from "../assets/images/essentials.png"; // Crew socks, 3 pack
import socks2 from "../assets/images/essentials.png"; // Striped sport socks

/* ---------- Slides ---------- */
import slides1 from "../assets/images/essentials.png"; // Cloud slides
import slides2 from "../assets/images/essentials.png"; // Zebra logo slides

/* ---------- Backpacks ---------- */
import backpack1 from "../assets/images/essentials.png"; // City backpack
import backpack2 from "../assets/images/essentials.png"; // Mini backpack

/* ---------- Duffel bags ---------- */
import duffel1 from "../assets/images/essentials.png"; // Weekender duffel
import duffel2 from "../assets/images/essentials.png"; // Gym duffel

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
  /* ---------- JEANS & TROUSERS ---------- */
  {
    id: "jeans-trousers",
    label: "Jeans & trousers",
    products: [
      item("Jeans & trousers", "straight-leg-jeans", "Straight leg jeans", "Classic fit in washed indigo denim.", 320, jeans1),
      item("Jeans & trousers", "relaxed-chinos", "Relaxed chinos", "Soft cotton twill with an easy cut.", 280, jeans2),
      item("Jeans & trousers", "weekend-jogger", "Weekend jogger", "Soft brushed cotton with a tapered leg.", 210, jeans3),
    ],
  },

  /* ---------- SNEAKERS ---------- */
  {
    id: "sneakers",
    label: "Sneakers",
    products: [
      item("Sneakers", "court-low-sneaker", "Court low sneaker", "Clean leather upper for everyday wear.", 450, sneaker1),
      item("Sneakers", "zebra-runner", "Zebra runner", "Light cushioned sole with a bold finish.", 520, sneaker2),
    ],
  },

  /* ---------- GRAPHIC TEES ---------- */
  {
    id: "graphic-tees",
    label: "Graphic tees",
    products: [
      item("Graphic tees", "zebra-classic-tee", "Zebra classic tee", "Heavy cotton with the signature zebra print.", 120, tee1, { badge: "Trending" }),
      item("Graphic tees", "oversized-navy-tee", "Oversized navy tee", "Relaxed drop shoulder fit.", 130, tee2),
    ],
  },

  /* ---------- HOODIES & JACKETS ---------- */
  {
    id: "hoodies-jackets",
    label: "Hoodies & jackets",
    products: [
      item("Hoodies & jackets", "essential-hoodie", "Essential unisex hoodie", "Brushed fleece lining, made to be shared.", 280, hoodie1, { badge: "Bestseller" }),
      item("Hoodies & jackets", "coach-jacket", "Coach jacket", "Lightweight layer with snap buttons.", 360, jacket1),
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

  /* ---------- JORTS ---------- */
  {
    id: "jorts",
    label: "Jorts",
    products: [
      item("Jorts", "relaxed-denim-jorts", "Relaxed denim jorts", "Knee length with a loose fit.", 190, jorts1),
      item("Jorts", "faded-black-jorts", "Faded black jorts", "Washed black denim, worn in feel.", 200, jorts2),
    ],
  },

  /* ---------- CAPS ---------- */
  {
    id: "caps",
    label: "Caps",
    products: [
      item("Caps", "everyday-cap", "Everyday cap", "Six panel cotton cap, adjustable strap.", 90, cap1, { badge: "New" }),
      item("Caps", "zebra-dad-cap", "Zebra dad cap", "Curved brim with embroidered logo.", 100, cap2),
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

  /* ---------- SLIDES ---------- */
  {
    id: "slides",
    label: "Slides",
    products: [
      item("Slides", "cloud-slides", "Cloud slides", "Soft foam footbed, easy to slip on.", 130, slides1),
      item("Slides", "zebra-logo-slides", "Zebra logo slides", "Waterproof strap with a raised logo.", 150, slides2),
    ],
  },

  /* ---------- BACKPACKS ---------- */
  {
    id: "backpacks",
    label: "Backpacks",
    products: [
      item("Backpacks", "city-backpack", "City backpack", "Padded laptop sleeve and two pockets.", 340, backpack1),
      item("Backpacks", "mini-backpack", "Mini backpack", "Compact size for everyday essentials.", 240, backpack2),
    ],
  },

  /* ---------- DUFFEL BAGS ---------- */
  {
    id: "duffel-bags",
    label: "Duffel bags",
    products: [
      item("Duffel bags", "weekender-duffel", "Weekender duffel", "Roomy canvas bag with a shoulder strap.", 380, duffel1),
      item("Duffel bags", "gym-duffel", "Gym duffel", "Water resistant with a shoe compartment.", 320, duffel2),
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