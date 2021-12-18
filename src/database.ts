import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_USER_TEST,
  POSTGRES_DB_TEST,
  ENV,
  POSTGRES_PASSWORD,
} = process.env;

const db = new Pool({
  user: ENV === "test" ? POSTGRES_USER_TEST : POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: ENV === "test" ? POSTGRES_DB_TEST : POSTGRES_DB,
  host: POSTGRES_HOST,
});

export default db;
