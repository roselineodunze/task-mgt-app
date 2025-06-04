import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function verifyToken(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized: No token provided" }));
    return false;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized: Invalid token" }));
    return false;
  }
}
