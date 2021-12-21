import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  ENV,
  DB_HOST,
  DB_PORT,
  TEST_DB,
  TEST_USER,
  TEST_PASSWORD,
  DEV_DB,
  DEV_USER,
  DEV_PASSWORD,
} = process.env;

const db = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT!),
  database: ENV === "test" ? TEST_DB : DEV_DB,
  user: ENV === "test" ? TEST_USER : DEV_USER,
  password: ENV === "test" ? TEST_PASSWORD : DEV_PASSWORD,
});

export default db;
