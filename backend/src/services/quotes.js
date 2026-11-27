import { and, eq, gte } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const { products, productVariants } = schema;

export async function quoteOrder(items) {
  const deliveryFeePesewas = env.DELIVERY_FEE_PESEWAS;
  const quotedItems = [];
  let subtotalPesewas = 0;

  for (const item of items) {
    const [product] = await db.select().from(products).where(and(eq(products.id, item.productId), eq(products.active, true))).limit(1);
    if (!product) throw new HttpError(400, `Product ${item.productId} is unavailable.`);
    const [variant] = await db.select().from(productVariants).where(and(
      eq(productVariants.productId, item.productId), eq(productVariants.color, item.color),
      eq(productVariants.size, item.size), eq(productVariants.active, true),
    )).limit(1);
    if (!variant) throw new HttpError(400, `The selected option for ${product.name} is unavailable.`);
    if (variant.stockQuantity < item.quantity) throw new HttpError(409, `Only ${variant.stockQuantity} unit(s) remain for ${product.name} (${item.color}, ${item.size}).`);
    const lineTotalPesewas = product.pricePesewas * item.quantity;
    subtotalPesewas += lineTotalPesewas;
    quotedItems.push({ productId: product.id, name: product.name, color: item.color, size: item.size, quantity: item.quantity, unitPricePesewas: product.pricePesewas, lineTotalPesewas });
  }

  return { items: quotedItems, subtotalPesewas, deliveryFeePesewas, totalPesewas: subtotalPesewas + deliveryFeePesewas, currency: "GHS", reservationMinutes: env.ORDER_RESERVATION_MINUTES };
}
