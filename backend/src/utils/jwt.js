import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ISSUER = "policezebra-api";
export function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    issuer: ISSUER,
    algorithm: "HS256",
    expiresIn: `${env.JWT_EXPIRES_DAYS}d`,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: ISSUER,
    algorithms: ["HS256"],
  });
}