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
  req.on("end", async () => {
    const reqBody = JSON.parse(book);
    await BookModel.add(reqBody);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "New Book Added successfully" }));
    res.end();
  });
};

const editBook = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const bookId = parseUrl.query.id;

  let bookNewInfo = "";

  req.on("data", (data) => {
    bookNewInfo = bookNewInfo + data.toString();
  });

  req.on("end", async () => {
    const reqBody = JSON.parse(bookNewInfo);
    const bookExists = await BookModel.bookExists(bookId);

    if (!bookExists) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Book not found" }));
      return res.end();
    }

    await BookModel.updateBook(bookId, reqBody);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "book changed successfully" }));
    res.end();
  });
};

module.exports = {
  getAll,
  removeOne,
  addOne,
  editBook,
};
