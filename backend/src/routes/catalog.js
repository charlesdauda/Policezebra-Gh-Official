import { Router } from "express";
import { and, eq, asc } from "drizzle-orm";
import { db, schema } from "../db/index.js";

const router = Router();
const { products, productVariants } = schema;

router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.select().from(products).where(eq(products.active, true)).orderBy(asc(products.name));
    res.json({ products: rows.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      pricePesewas: product.pricePesewas,
      currency: "GHS",
    })) });
  } catch (error) { next(error); }
});

router.get("/:productId/variants", async (req, res, next) => {
  try {
    const variants = await db.select({ color: productVariants.color, size: productVariants.size, stockQuantity: productVariants.stockQuantity })
      .from(productVariants).where(and(eq(productVariants.productId, req.params.productId), eq(productVariants.active, true)));
    res.json({ variants });
  } catch (error) { next(error); }
});

export default router;
