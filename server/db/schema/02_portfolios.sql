DROP TABLE IF EXISTS portfolios CASCADE;
CREATE TABLE portfolios(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  live BOOLEAN NOT NULL,
  spec_money BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id)
);
