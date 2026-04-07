import mysql2 from "mysql2/promise";

export const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "book_store_db",
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("database connection success");
    connection.release();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
