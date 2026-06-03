import pg from "pg";
import dotenv from "dotenv"
const { Pool } = pg;
dotenv.config({ path: "../.env" });
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({ connectionString })
  : new Pool();

export const db = {
  query(text, params = []) {
    return pool.query(text, params);
  },
};