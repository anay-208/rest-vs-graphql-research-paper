# rest-backend

A REST API that exposes the same data as `../graphql-backend`, built for a
side-by-side GraphQL-vs-REST performance comparison.

Both backends share the exact same data layer (`../db`) and produce identical
scalar JSON shapes, so the only variable being measured is the API style.

- GraphQL server: `http://localhost:4000/graphql`
- REST server: `http://localhost:4001`

## Run

```bash
pnpm install
DATABASE_URL=postgres://... node index.js   # defaults to PORT=4001
```

## Endpoints

| Method & path                | Returns          | GraphQL equivalent       |
| ---------------------------- | ---------------- | ------------------------ |
| `GET /users`                 | `User[]`         | `users`                  |
| `GET /users/:id`             | `User` (404)     | `user(id)`               |
| `GET /users/:id/posts`       | `Post[]`         | `User.posts`             |
| `GET /users/:id/comments`    | `Comment[]`      | `User.comments`          |
| `GET /posts`                 | `Post[]`         | `posts`                  |
| `GET /posts/:id`             | `Post` (404)     | `post(id)`               |
| `GET /posts/:id/comments`    | `Comment[]`      | `Post.comments`          |
| `GET /comments`              | `Comment[]`      | `comments`               |
| `GET /comments/:id`          | `Comment` (404)  | `comment(id)`            |

### Relationship resolution

GraphQL resolves `Post.author`, `Comment.author`, and `Comment.post` within a
single request. In REST these are followed client-side using the `userId` /
`postId` field on each resource (e.g. `GET /posts/:id` then `GET /users/:userId`).
That extra round-trip is exactly the over-fetching / N+1 behaviour the
comparison is meant to surface — it is intentional, not an omission.

Collection sub-resources (e.g. `GET /users/:id/posts`) return `[]` for a missing
or childless parent rather than issuing a second existence query, keeping each
endpoint to a single database round-trip.
