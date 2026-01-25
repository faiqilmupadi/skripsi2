import mysql from "mysql2/promise";

// 1. Definisikan tipe agar TypeScript tidak komplain soal global variable
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

// 2. Konfigurasi Database (Sudah disesuaikan dengan ENV kamu)
const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "", // Password kosong
  database: process.env.DATABASE_NAME || "skripsi", // Default ke database 'skripsi'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool;

// 3. Logika Singleton (Agar tidak "Too Many Connections")
if (process.env.NODE_ENV === "production") {
  pool = mysql.createPool(dbConfig);
} else {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  pool = global.mysqlPool;
}

// 4. Helper untuk mengambil instance pool (opsional)
export const getDb = () => pool;

// 5. ✅ Fungsi wrapper "query" agar bisa dipanggil di API
export const query = async (sql: string, values?: any[]) => {
  try {
    // pool.query mengembalikan [rows, fields], kita ambil rows-nya saja
    const [results] = await pool.query(sql, values);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw error; // Lempar error agar bisa ditangkap di API
  }
};