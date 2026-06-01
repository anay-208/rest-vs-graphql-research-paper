import {
  getUsers as getUsersRows,
  getUserById as getUserByIdRow,
} from "../../db/queries/users.js";
import {
  getPosts as getPostsRows,
  getPostById as getPostByIdRow,
  getPostsByUserId as getPostsByUserIdRows,
} from "../../db/queries/posts.js";
import {
  getComments as getCommentsRows,
  getCommentById as getCommentByIdRow,
  getCommentsByUserId as getCommentsByUserIdRows,
  getCommentsByPostId as getCommentsByPostIdRows,
} from "../../db/queries/comments.js";

const toISO = (value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
};

const getUserById = async (id) => {
  const row = await getUserByIdRow(id);
  return row ? toUser(row) : null;
};

const getPostById = async (id) => {
  const row = await getPostByIdRow(id);
  return row ? toPost(row) : null;
};

const getCommentById = async (id) => {
  const row = await getCommentByIdRow(id);
  return row ? toComment(row) : null;
};

const getPostsByUserId = async (userId) =>
  (await getPostsByUserIdRows(userId)).map(toPost);

const getCommentsByUserId = async (userId) =>
  (await getCommentsByUserIdRows(userId)).map(toComment);

const getCommentsByPostId = async (postId) =>
  (await getCommentsByPostIdRows(postId)).map(toComment);

const toUser = (row) => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  createdAt: toISO(row.created_at),
  posts: () => getPostsByUserId(row.id),
  comments: () => getCommentsByUserId(row.id),
});

const toPost = (row) => ({
  id: String(row.id),
  userId: String(row.user_id),
  title: row.title,
  body: row.body,
  createdAt: toISO(row.created_at),
  author: () => getUserById(row.user_id),
  comments: () => getCommentsByPostId(row.id),
});

const toComment = (row) => ({
  id: String(row.id),
  postId: String(row.post_id),
  userId: String(row.user_id),
  body: row.body,
  createdAt: toISO(row.created_at),
  author: () => getUserById(row.user_id),
  post: () => getPostById(row.post_id),
});

const users = async () => (await getUsersRows()).map(toUser);
const user = async ({ id }) => getUserById(id);
const posts = async () => (await getPostsRows()).map(toPost);
const post = async ({ id }) => getPostById(id);
const comments = async () => (await getCommentsRows()).map(toComment);
const comment = async ({ id }) => getCommentById(id);

const rootValue = {
  users,
  user,
  posts,
  post,
  comments,
  comment,
};

export default rootValue;
