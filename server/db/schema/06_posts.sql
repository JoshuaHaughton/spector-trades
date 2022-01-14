DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  portfolio_id INT,
  asset_id INT,
  description TEXT,
  created_at DATE
);
