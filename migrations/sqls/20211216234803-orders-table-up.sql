/* Replace with your SQL commands */
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id),
  status boolean
);
