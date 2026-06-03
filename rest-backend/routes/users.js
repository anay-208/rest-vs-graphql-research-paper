import { Router } from "express";
import { getUsers, getUserById } from "../../db/queries/users.js";
import { getPostsByUserId } from "../../db/queries/posts.js";
import { getCommentsByUserId } from "../../db/queries/comments.js";
import { toUser, toPost, toComment } from "../serializers.js";

const router = Router();

// Query.users
router.get("/", async (_req, res) => {
  const rows = await getUsers();
  res.json(rows.map(toUser));
});

// Query.user(id)
router.get("/:id", async (req, res) => {
  const row = await getUserById(req.params.id);

  if (!row) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(toUser(row));
});

// User.posts
router.get("/:id/posts", async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const rows = await getPostsByUserId(req.params.id);
  res.json(rows.map(toPost));
});

// User.comments
router.get("/:id/comments", async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const rows = await getCommentsByUserId(req.params.id);
  res.json(rows.map(toComment));
});

export default router;
