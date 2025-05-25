import bcrypt from "bcrypt";
import db from "../db.js";

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
            return res.end(JSON.stringify({ error: "Invalid email or password." }));
          }

          const user = existingUser[0]

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            res.writeHead(401, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid email or password." }));
          }


          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User successfully logged in.", user }));
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
          const { fullname, email, password } = JSON.parse(body);

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
          await db.query(
            "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
            [fullname, email, hashedPassword]
          );

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User successfully registered. Please log in.",
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
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } else {
    return false;
  }
}
