// Row -> resource serializers.
//
// These produce exactly the same scalar shapes the GraphQL resolvers return
// (see ../graphql-backend/resolvers/index.js), so the only thing that differs
// between the two backends is the API style, not the payload contents.

const toISO = (value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
};

export const toUser = (row) => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  createdAt: toISO(row.created_at),
});

export const toPost = (row) => ({
  id: String(row.id),
  userId: String(row.user_id),
  title: row.title,
  body: row.body,
  createdAt: toISO(row.created_at),
});

export const toComment = (row) => ({
  id: String(row.id),
  postId: String(row.post_id),
  userId: String(row.user_id),
  body: row.body,
  createdAt: toISO(row.created_at),
});
