import { db } from "../client.js";

export const getComments = async () => {
  const result = await db.query(
    `
      SELECT id, post_id, user_id, body, created_at
      FROM comments
      ORDER BY id
    `,
  );

  return result.rows;
};

export const getCommentById = async (id) => {
  const result = await db.query(
    `
      SELECT id, post_id, user_id, body, created_at
      FROM comments
      WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

export const getCommentsByUserId = async (userId) => {
  const result = await db.query(
    `
      SELECT id, post_id, user_id, body, created_at
      FROM comments
      WHERE user_id = $1
      ORDER BY id
    `,
    [userId],
  );

  return result.rows;
};

export const getCommentsByPostId = async (postId) => {
  const result = await db.query(
    `
      SELECT id, post_id, user_id, body, created_at
      FROM comments
      WHERE post_id = $1
      ORDER BY id
    `,
    [postId],
  );

  return result.rows;
};
