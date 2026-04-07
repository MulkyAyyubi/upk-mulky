import { pool } from "../config/db.js";
import { ResponseError } from "../error/responseError.js";
import {
  createBooksSchema,
  updateBooksSchema,
} from "../validations/bookValidation.js";
import validate from "../validations/validate.js";

export const getAllBook = async () => {
  const [books] = await pool.query("SELECT * FROM books");

  return books;
};

export const getBookById = async (id) => {
  const [books] = await pool.query("SELECT * FROM books WHERE id=?", [id]);

  if (books.length === 0) {
    throw new ResponseError(404, "product with such id does not exist");
  }

  return books[0];
};

export const createBook = async (request) => {
  const validated = validate(createBooksSchema, request);

  const { title, author, price, category, description, image_url } = validated;

  const [result] = await pool.query(
    "INSERT INTO books (title, author, price, category, description, image_url) VALUES (?,?,?,?,?,?)",
    [title, author, price, category, description, image_url],
  );

  const newBook = {
    id: result.insertId,
    title,
    author,
    price,
    category,
    description,
    image_url,
  };

  return newBook;
};

export const updateBook = async (id, request) => {
  const validated = validate(updateBooksSchema, request);
  const existingBook = await getBookById(id);

  const updatedBook = {
    title: validated.title ?? existingBook.title,
    author: validated.author ?? existingBook.author,
    price: validated.price ?? existingBook.price,
    category: validated.category ?? existingBook.category,
    description: validated.description ?? existingBook.description,
    image_url: validated.image_url ?? existingBook.image_url,
  };

  const [result] = await pool.query(
    "UPDATE books SET title = ?, author = ?, price = ?, category = ?, description = ?, image_url = ? WHERE id = ?",
    [
      updatedBook.title,
      updatedBook.author,
      updatedBook.price,
      updatedBook.category,
      updatedBook.description,
      updatedBook.image_url,
      id,
    ],
  );

  if (result.affectedRows === 0) {
    throw new ResponseError(404, "product with such id does not exist");
  }

  return { id: Number(id), ...updatedBook };
};

export const deleteBook = async (id) => {
  const [books] = await pool.query("DELETE FROM books WHERE id = ?", [id]);

  if (books.affectedRows === 0) {
    throw new ResponseError(404, " product with such id does not exist");
  }
};
