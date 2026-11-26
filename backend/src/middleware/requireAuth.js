import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { COOKIE_NAME } from "../utils/authCookie.js";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "Please sign in." });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in." });
  }

  const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
  if (!user || !user.phoneVerified) {
    return res.status(401).json({ message: "Please sign in." });
  }

  req.user = user;
  next();
}