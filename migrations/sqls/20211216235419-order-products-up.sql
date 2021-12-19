/* Replace with your SQL commands */
CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  product_id integer REFERENCES products(id) ON DELETE CASCADE,
  order_id integer REFERENCES orders(id) ON DELETE CASCADE,
  quantity integer NOT NULL
);
