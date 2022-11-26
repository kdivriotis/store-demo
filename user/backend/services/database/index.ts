import { Pool, createPool } from "mysql2";

const poolNoPromise: Pool = createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "store",
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

export const pool = poolNoPromise.promise();
