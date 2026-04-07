import * as BookService from "../services/bookServices.js";

export const getAllBookHandler = async (req, res, next) => {
  try {
    const response = await BookService.getAllBook();

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await BookService.getBookById(id);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const createBookHandler = async (req, res, next) => {
  try {
    const response = await BookService.createBook(req.body);

    res.status(201).json({
      status: "success",
      message: "berhasil",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await BookService.updateBook(id, req.body);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBookHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    await BookService.deleteBook(id);

    res.status(200).json({
      status: "success",
      message: "Book has been successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
