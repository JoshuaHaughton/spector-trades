DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL REFERENCES users(id),
  post_id INT REFERENCES posts(id),
  body TEXT NOT NULL,
  created_at DATE NOT NULL
);
