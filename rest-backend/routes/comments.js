import { Router } from "express";
import { getComments, getCommentById } from "../../db/queries/comments.js";
import { toComment } from "../serializers.js";

const router = Router();

// Query.comments
router.get("/", async (_req, res) => {
  const rows = await getComments();
  res.json(rows.map(toComment));
});

// Query.comment(id)
router.get("/:id", async (req, res) => {
  const row = await getCommentById(req.params.id);

  if (!row) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  res.json(toComment(row));
});

export default router;
