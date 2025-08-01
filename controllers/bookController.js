const url = require("url");
const BookModel = require("../models/Book");

const getAll = async (req, res) => {
  const book = await BookModel.findAll();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(book));
  res.end();
};

const removeOne = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const bookId = parseUrl.query.id;
  const bookExists = await BookModel.bookExists(bookId);
  if (!bookExists) {
    // If not found, return 404 error
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Book not found" }));
    return res.end();
  } else {
    await BookModel.remove(bookId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Book removed successfully" }));
    res.end();
  }
};

const addOne = async (req, res) => {
  let book = "";
  req.on("data", (data) => {
    book = book + data.toString();
  });
  const lastId = await BookModel.lastId();
  const newBook = {
    id: lastId + 1,
    ...JSON.parse(book),
    free: 1,
  };
  BookModel.add(newBook);
  res.writeHead(201, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ message: "New Book Added successfully" }));
  res.end();
};

const editBook = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const bookId = parseUrl.query.id;

  let bookNewInfo = "";

  req.on("data", (data) => {
    bookNewInfo = bookNewInfo + data.toString();
  });

  const bookExists = await BookModel.bookExists(bookId);
  if (!bookExists) {
    // If not found, return 404 error
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Book not found" }));
    return res.end();
  }

  req.on("end", () => {
    const reqBody = JSON.parse(bookNewInfo);
    BookModel.editBook(bookId, reqBody);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "book change successfully" }));
    res.end();
  });
};

module.exports = {
  getAll,
  removeOne,
  addOne,
  editBook,
};
