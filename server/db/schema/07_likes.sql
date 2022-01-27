DROP TABLE IF EXISTS likes CASCADE;
CREATE TABLE likes (
  id SERIAL PRIMARY KEY NOT NULL,
  original_article_id VARCHAR(50) REFERENCES articles(original_id),
  post_id INTEGER REFERENCES posts(id),
  liker_id INTEGER NOT NULL REFERENCES users(id)
);
