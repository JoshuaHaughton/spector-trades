-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  password_digest VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at DATE NOT NULL DEFAULT NOW()
);
