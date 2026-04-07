import express from "express";
import {
  createBookHandler,
  deleteBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookHandler,
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.get("/books", getAllBookHandler);
bookRouter.get("/books/:id", getBookByIdHandler);
bookRouter.post("/books", createBookHandler);
bookRouter.put("/books/:id", updateBookHandler);
bookRouter.delete("/books/:id", deleteBookHandler);

export default bookRouter;
