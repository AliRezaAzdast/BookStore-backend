const url = require("url");
const BookModel = require("../models/Book");

const getAll = async (req, res) => {
  const book = await BookModel.find();

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

module.exports = {
  getAll,
  removeOne,
};
