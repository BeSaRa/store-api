/* Replace with your SQL commands */
CREATE TYPE order_status AS ENUM ('active', 'complete');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  status order_status DEFAULT 'active'
);
