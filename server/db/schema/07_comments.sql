DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  post_id INT,
  body TEXT,
  created_at DATE
);
