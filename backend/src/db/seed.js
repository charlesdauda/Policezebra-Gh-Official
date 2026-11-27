import { readFile } from "node:fs/promises";
import { z } from "zod";
import { inArray, sql } from "drizzle-orm";
import { db, pool } from "./index.js";
import { products, productVariants } from "./schema.js";

const catalogUrl = new URL("../../../shared/products.json", import.meta.url);

const colorSchema = z.object({
  name: z.string().min(1).max(80),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
}).strict();

const productSchema = z.object({
  id: z.string().min(1).max(120),
  brand: z.string().min(1),
  category: z.string().min(1).max(120),
  name: z.string().min(1).max(240),
  description: z.string(),
  priceGhs: z.number().positive(),
  oldPriceGhs: z.number().positive().optional(),
  badge: z.string().optional(),
  imageId: z.string().min(1),
  galleryImageIds: z.array(z.string().min(1)),
  colors: z.array(z.string().min(1)).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  active: z.boolean(),
}).strict();

const catalogueSchema = z.object({
  colorOptions: z.array(colorSchema).min(1),
  categories: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    products: z.array(productSchema),
  }).strict()).min(1),
}).strict();

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const toPesewas = (priceGhs, productId) => {
  const scaledPrice = priceGhs * 100;
  const pricePesewas = Math.round(scaledPrice);
  if (!Number.isSafeInteger(pricePesewas) || Math.abs(scaledPrice - pricePesewas) > 1e-8) {
    throw new Error(`Product "${productId}" has a GHS price with more than two decimal places.`);
  }
  return pricePesewas;
};

const skuFor = (productId, color, size) =>
  `${productId}-${color}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-");

const variantKey = (productId, color, size) =>
  JSON.stringify([productId, color, size]);

const loadCatalogue = async () => {
  const source = await readFile(catalogUrl, "utf8");
  const catalogue = catalogueSchema.parse(JSON.parse(source));
  const knownColors = new Set(catalogue.colorOptions.map(({ name }) => name));
  const allProducts = catalogue.categories.flatMap(({ products: entries }) => entries);
  const ids = new Set();
  const slugs = new Set();

  for (const product of allProducts) {
    if (ids.has(product.id)) throw new Error(`Duplicate product id in catalogue: ${product.id}`);
    ids.add(product.id);

    const slug = slugify(product.id);
    if (!slug || slugs.has(slug)) throw new Error(`Duplicate or invalid product slug: ${product.id}`);
    slugs.add(slug);
    toPesewas(product.priceGhs, product.id);

    for (const color of product.colors) {
      if (!knownColors.has(color)) {
        throw new Error(`Product "${product.id}" uses unknown color "${color}".`);
      }
    }
    if (new Set(product.colors).size !== product.colors.length) {
      throw new Error(`Product "${product.id}" contains duplicate colors.`);
    }
    if (new Set(product.sizes).size !== product.sizes.length) {
      throw new Error(`Product "${product.id}" contains duplicate sizes.`);
    }
  }

  if (allProducts.length === 0) throw new Error("The shared product catalogue is empty.");
  return allProducts;
};

const synchronizeCatalogue = async (catalogueProducts) => {
  const now = new Date();
  const productRows = catalogueProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: slugify(product.id),
    description: product.description,
    pricePesewas: toPesewas(product.priceGhs, product.id),
    category: product.category,
    imagePath: product.imageId,
    gallery: product.galleryImageIds,
    active: product.active,
    updatedAt: now,
  }));
  const activeByProductId = new Map(productRows.map(({ id, active }) => [id, active]));
  const variantRows = catalogueProducts.flatMap((product) =>
    product.colors.flatMap((color) =>
      product.sizes.map((size) => ({
        productId: product.id,
        color,
        size,
        sku: skuFor(product.id, color, size),
        active: product.active,
        updatedAt: now,
      }))
    )
  );

  await db.transaction(async (tx) => {
    const existingProducts = await tx
      .select({ id: products.id, active: products.active })
      .from(products);
    const existingProductIds = new Set(existingProducts.map(({ id }) => id));
    const existingVariants = await tx
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        color: productVariants.color,
        size: productVariants.size,
        active: productVariants.active,
      })
      .from(productVariants);
    const existingVariantKeys = new Set(
      existingVariants.map(({ productId, color, size }) => variantKey(productId, color, size))
    );
    const desiredVariantKeys = new Set(
      variantRows.map(({ productId, color, size }) => variantKey(productId, color, size))
    );

    await tx.insert(products).values(productRows).onConflictDoUpdate({
      target: products.id,
      set: {
        name: sql`excluded.name`,
        slug: sql`excluded.slug`,
        description: sql`excluded.description`,
        pricePesewas: sql`excluded.price_pesewas`,
        category: sql`excluded.category`,
        imagePath: sql`excluded.image_path`,
        gallery: sql`excluded.gallery`,
        active: sql`excluded.active`,
        updatedAt: now,
      },
    });

    const insertedProductIds = productRows
      .filter(({ id }) => !existingProductIds.has(id))
      .map(({ id }) => id);
    const updatedProductIds = productRows
      .filter(({ id }) => existingProductIds.has(id))
      .map(({ id }) => id);
    const deactivatedProducts = existingProducts
      .filter(({ id, active }) => active && !activeByProductId.has(id))
      .map(({ id }) => id);

    if (deactivatedProducts.length > 0) {
      await tx.update(products)
        .set({ active: false, updatedAt: now })
        .where(inArray(products.id, deactivatedProducts));
    }

    await tx.insert(productVariants).values(variantRows).onConflictDoUpdate({
      target: [productVariants.productId, productVariants.color, productVariants.size],
      set: {
        sku: sql`excluded.sku`,
        active: sql`excluded.active`,
        updatedAt: now,
      },
    });

    const obsoleteVariantIds = existingVariants
      .filter(({ id, productId, color, size, active }) =>
        active && (!desiredVariantKeys.has(variantKey(productId, color, size)) ||
          activeByProductId.get(productId) === false)
      )
      .map(({ id }) => id);
    if (obsoleteVariantIds.length > 0) {
      await tx.update(productVariants)
        .set({ active: false, updatedAt: now })
        .where(inArray(productVariants.id, obsoleteVariantIds));
    }

    console.info(`Inserted products (${insertedProductIds.length}): ${insertedProductIds.join(", ") || "none"}`);
    console.info(`Updated products (${updatedProductIds.length}): ${updatedProductIds.join(", ") || "none"}`);
    console.info(`Deactivated products (${deactivatedProducts.length}): ${deactivatedProducts.join(", ") || "none"}`);
    console.info(`Inserted product variations: ${variantRows.filter((row) => !existingVariantKeys.has(variantKey(row.productId, row.color, row.size))).length}`);
    console.info(`Deactivated product variations: ${obsoleteVariantIds.length}`);
  });
};

const main = async () => {
  try {
    const catalogue = await loadCatalogue();
    await synchronizeCatalogue(catalogue);
    console.info(`Product catalogue sync complete (${catalogue.length} products).`);
  } catch (error) {
    console.error("Product catalogue synchronization failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

await main();
