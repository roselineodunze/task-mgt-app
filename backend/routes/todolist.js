import db from "../db.js";
import url from "url";
import { verifyToken } from "../middlewares/auth.js";

export function handleToDoRoutes(req, res) {
  const { method, url: requestUrl } = req;
  const parsedUrl = url.parse(requestUrl, true);

  if (parsedUrl.pathname.startsWith("/api/todos")) {
    // GET all todos
    if (parsedUrl.pathname === "/api/todos" && method === "GET") {
      const verfiedUserId = verifyToken(req, res);

      if (!verfiedUserId) {
        return;
      }
      const userId = req.user.userId;

      db.query("SELECT * FROM tasks WHERE userId = ?", [userId])
        .then(([rows]) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(rows));
        })
        .catch((err) => {
          console.error("❌ Error fetching tasks:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to fetch tasks" }));
        });

      // POST a new todo
    } else if (parsedUrl.pathname === "/api/todos" && method === "POST") {
      const verfiedUserId = verifyToken(req, res);

      if (!verfiedUserId) {
        return;
      }
      const userId = req.user.userId;
 
      let body = "";
      req.on("data", (chunk) => (body += chunk));

      req.on("end", async () => {
        try {
          const { task } = JSON.parse(body);

          if (!task) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Please enter a task!" }));
          }

          await db.query("INSERT INTO tasks (task, userId) VALUES (?, ?)", [
            task,
            userId,
          ]);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "New task received", task }));
        } catch (err) {
          console.error("❌ Signup error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Server error, please try again later." })
          );
        }
      });

      // DELETE TODOS
    } else if (
      parsedUrl.pathname === "/api/todos/delete" &&
      method === "POST"
    ) {
      const verfiedUserId = verifyToken(req, res);

      if (!verfiedUserId) {
        return
      }
      
      let body = "";
      req.on("data", (chunk) => (body += chunk));

      req.on("end", async () => {
        try {
          const { id } = JSON.parse(body);

          if (!id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "No id passed!" }));
          }

          const [taskExists] = await db.query(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
          );

          if (taskExists.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Task not found" }));
          }

          const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [
            id,
          ]);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Task deleted successfully" }));
        } catch (err) {
          console.error("❌ Signup error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Server error, please try again later." })
          );
        }
      });

      // EDIT TODO
    } else if (parsedUrl.pathname === "/api/todos/edit" && method === "POST") {
      const verfiedUserId = verifyToken(req, res);

      if (!verfiedUserId) {
        return
      }
      let body = "";
      req.on("data", (chunk) => (body += chunk));

      req.on("end", async () => {
        try {
          const { task, isCompleted, id } = JSON.parse(body);

          if (!id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Task ID is required" }));
            return;
          }

          const [taskExists] = await db.query(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
          );

          if (taskExists.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Task not found" }));
          }

          await db.query(
            "UPDATE tasks SET task = ?, isCompleted = ? WHERE id = ?",
            [task, isCompleted, id]
          );

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Task updated successfully" }));
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
