import "../src/config/env.js";
import bcrypt from "bcryptjs";
import { db, pool } from "../src/db/index.js";
import { adminUsers } from "../src/db/schema.js";

const email = process.env.NEW_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.NEW_ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  console.error("Set NEW_ADMIN_EMAIL and NEW_ADMIN_PASSWORD (at least 12 characters) before running this script.");
  process.exit(1);
}
try {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ email, passwordHash, role: "admin", active: true }).onConflictDoNothing();
  console.log(`Administrator account ensured for ${email}.`);
} finally { await pool.end(); }
