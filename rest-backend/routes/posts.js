import { Router } from "express";
import { getPosts, getPostById } from "../../db/queries/posts.js";
import { getCommentsByPostId } from "../../db/queries/comments.js";
import { toPost, toComment } from "../serializers.js";

const router = Router();

// Query.posts
router.get("/", async (_req, res) => {
  const rows = await getPosts();
  res.json(rows.map(toPost));
});

// Query.post(id)
router.get("/:id", async (req, res) => {
  const row = await getPostById(req.params.id);

  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(toPost(row));
});

// Post.comments
router.get("/:id/comments", async (req, res) => {
  const post = await getPostById(req.params.id);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const rows = await getCommentsByPostId(req.params.id);
  res.json(rows.map(toComment));
});

export default router;
