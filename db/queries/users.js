import { db } from "../client.js";

export const getUsers = async () => {
  const result = await db.query(
    `
      SELECT id, name, email, bio, avatar_url, created_at
      FROM users
      ORDER BY id
    `,
  );

  return result.rows;
};

export const getUserById = async (id) => {
  const result = await db.query(
    `
      SELECT id, name, email, bio, avatar_url, created_at
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};
