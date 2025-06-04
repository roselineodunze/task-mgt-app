import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export function handleAuthRoutes(req, res) {
  const { method, url } = req;

  if (url.startsWith("/api/auth")) {
    if (url === "/api/auth/login" && method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));

      req.on("end", async () => {
        try {
          const { email, password } = JSON.parse(body);

          if (!email || !password) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "All fields are required!" })
            );
          }

          const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );

          if (existingUser.length === 0) {
            res.writeHead(401, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Invalid email or password." })
            );
          }

          const user = existingUser[0];

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            res.writeHead(401, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Invalid email or password." })
            );
          }

          const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
          });
          console.log(user)

          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              message: "User successfully logged in.",
              data: { token, user },
            })
          );
        } catch (err) {
          console.error("❌ Signup error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Server error, please try again later." })
          );
        }
      });
    } else if (url === "/api/auth/signup" && method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));

      req.on("end", async () => {
        try {
          const { fullname, email, password, quote } = JSON.parse(body);

          if (!fullname || !email || !password) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "All fields are required!" })
            );
          }

          const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );

          if (existingUser.length > 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Email is already registered." })
            );
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const [result] = await db.query(
            "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
            [fullname, email, hashedPassword]
          );
          const insertId = result.insertId;

          const [userRows] = await db.query(
            "SELECT id, fullname, email, quote FROM users WHERE id = ?",
            [insertId]
          );

          const newUser = userRows[0];

          const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
          });
          

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User successfully registered. Please log in.",
              data: { token, user: newUser },
            })
          );
        } catch (err) {
          console.error("❌ Signup error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Server error, please try again later.",
            })
          );
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } else if (url === "/api/edit-quote" && method === "POST") {
    return;
  } else {
    return false;
  }
}
