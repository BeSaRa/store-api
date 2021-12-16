import dotenv from 'dotenv';
import {Pool} from "pg";

dotenv.config();

const {POSTGRES_DB, POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD} = process.env;

const db = new Pool({
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  host: POSTGRES_HOST
})

export default db;
