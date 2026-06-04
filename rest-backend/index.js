import express from "express";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";

const app = express();

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

app.get("/", (_req, res) => {
  res.json({
    name: "rest-backend",
    endpoints: [
      "GET /users",
      "GET /users/:id",
      "GET /users/:id/posts",
      "GET /users/:id/comments",
      "GET /posts",
      "GET /posts/:id",
      "GET /posts/:id/comments",
      "GET /comments",
      "GET /comments/:id",
    ],
  });
});

// Unknown routes -> JSON 404 (instead of Express' default HTML page).
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Anything thrown/rejected in a handler lands here as a JSON 500.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT);
console.log(`Running a REST API server at http://localhost:${PORT}`);
