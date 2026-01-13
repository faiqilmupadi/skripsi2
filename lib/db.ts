import mysql from "mysql2/promise";

// 1. Definisikan tipe agar TypeScript tidak komplain soal global variable
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

// 2. Konfigurasi Database (Sesuai variable env kamu)
const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "waskita_db", // Ganti sesuai nama DB kamu
  waitForConnections: true,
  connectionLimit: 10, // Maksimal 10 koneksi sekaligus
  queueLimit: 0,
};

let pool: mysql.Pool;

// 3. Logika Singleton (Agar tidak "Too Many Connections" saat development)
if (process.env.NODE_ENV === "production") {
  pool = mysql.createPool(dbConfig);
} else {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  pool = global.mysqlPool;
}

// 4. Export fungsi untuk dipakai di Service / API
export const getDb = () => pool;