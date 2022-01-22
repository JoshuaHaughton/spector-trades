DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL REFERENCES users(id),
  -- portfolio_id INT NOT NULL REFERENCES portfolios(id),
  -- asset_order_id INT NOT NULL REFERENCES assets_order(id),
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW() 
);
