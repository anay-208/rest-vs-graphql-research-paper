import { db } from "../client.js";

export const getPosts = async () => {
  const result = await db.query(
    `
      SELECT id, user_id, title, body, created_at
      FROM posts
      ORDER BY id
    `,
  );

  return result.rows;
};

export const getPostById = async (id) => {
  const result = await db.query(
    `
      SELECT id, user_id, title, body, created_at
      FROM posts
      WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

export const getPostsByUserId = async (userId) => {
  const result = await db.query(
    `
      SELECT id, user_id, title, body, created_at
      FROM posts
      WHERE user_id = $1
      ORDER BY id
    `,
    [userId],
  );

  return result.rows;
};
