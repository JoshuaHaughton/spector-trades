DROP TABLE IF EXISTS asset_orders CASCADE;
CREATE TABLE asset_orders(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  type VARCHAR(250) NOT NULL,
  units INTEGER NOT NULL,
  price_at_purchase INTEGER NOT NULL,
  created_at DATE NOT NULL DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id),
  portfolio_id INTEGER REFERENCES portfolios(id),
  sold BOOLEAN NOT NULL
);
