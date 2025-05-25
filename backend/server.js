import http from "http";
import { handleToDoRoutes } from "./routes/todolist.js";
import { handleAuthRoutes } from "./routes/auth.js";
import createSchema from "./schema.js";

const PORT = 3000;

createSchema()
  .then(() => {
    const server = http.createServer((req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins, or restrict to specific origin
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific methods
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      if (req.method === "OPTIONS") {
        // Handle the preflight request for CORS
        res.writeHead(204); // No content
        res.end();
        return;
      }
      if (
        handleToDoRoutes(req, res) === false &&
        handleAuthRoutes(req, res) === false
      ) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found" }));
      }
    });

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to create schema. Server not started.", err);
  });
