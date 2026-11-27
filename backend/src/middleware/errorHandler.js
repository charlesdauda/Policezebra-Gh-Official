import { ZodError } from "zod";

export function notFound(_req, res) {
  res.status(404).json({ error: "Route not found." });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: "Please check the submitted information.", details: error.flatten().fieldErrors });
  }
  if (error?.type === "entity.parse.failed" || error?.status === 400) {
    return res.status(400).json({ error: "The request body is invalid." });
  }
  if (error?.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({ error: "Request origin is not allowed." });
  }
  if (error?.code === "23505") {
    return res.status(409).json({ error: "A record with those details already exists." });
  }
  const status = Number.isInteger(error?.status) ? error.status : 500;
  if (status >= 500) console.error("Request error:", error);
  return res.status(status).json({
    error: status >= 500 ? "An unexpected server error occurred." : error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}
