-- =====================
-- SCHEMA
-- =====================

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- =====================
-- SEED: 100 USERS
-- =====================

INSERT INTO users (name, email, bio, avatar_url)
SELECT
    'User ' || i,
    'user' || i || '@example.com',
    'This is the bio for User ' || i || '. They enjoy writing and discussing topics online.',
    'https://example.com/avatars/' || i || '.jpg'
FROM generate_series(1, 100) AS i;

-- =====================
-- SEED: 5 POSTS PER USER (500 total)
-- =====================

INSERT INTO posts (user_id, title, body)
SELECT
    u.id,
    'Post ' || s || ' by User ' || u.id,
    'This is the full body content of post ' || s || ' written by User ' || u.id ||
    '. It contains enough text to make payload size differences measurable across network profiles.'
FROM users u
CROSS JOIN generate_series(1, 5) AS s;

-- =====================
-- SEED: 10 COMMENTS PER POST FROM RANDOM USERS (5000 total)
-- =====================

INSERT INTO comments (post_id, user_id, body)
SELECT
    p.id,
    (1 + floor(random() * 100))::bigint,
    'Comment ' || s || ' on post ' || p.id || ' — this is a realistic comment body of reasonable length.'
FROM posts p
CROSS JOIN generate_series(1, 10) AS s;
