import { pool } from "../config/db.js";

export const getAllBookHandler = async (req, res) => {
  try {
    const [books] = await pool.query(
      "SELECT id, title, author, price, category FROM books",
    );

    res.status(200).json({
      message: "success",
      data: books,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getBookByIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const [books] = await pool.query(
      "SELECT title, author, price, category FROM books WHERE id = ?",
      [id],
    );

    if (books.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "book not found",
      });
    }

    res.status(200).json({
      message: "success",
      data: books[0],
    });
  } catch (error) {
    console.error(error);
  }
};

export const AddBookHandler = async (req, res) => {
  const { title, author, price, category } = req.body;
  try {
    const [userInsert] = await pool.query(
      "INSERT INTO books (title, author, price, category) VALUES (?, ?, ?, ?)",
      [title, author, price, category],
    );

    const newBook = {
      id: userInsert.insertId,
      title,
      author,
      price,
      category,
    };

    res.status(200).json({
      message: "success",
      data: newBook,
    });
  } catch (error) {
    console.error(error);
  }
};
