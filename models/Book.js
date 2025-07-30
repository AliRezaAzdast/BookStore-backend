const db = require("../db.json");
const fs = require("fs");

const find = () => {
  return new Promise((resolve, reject) => {
    resolve(db.books);
  });
};

const bookExists = (bookId) => {
  return new Promise((resolve, reject) => {
    resolve(db.books.some((book) => book.id == bookId));
  });
};

const remove = (bookId) => {
  return new Promise((resolve, reject) => {
    const newBooks = db.books.filter((book) => book.id != bookId);

    // Write the updated data back to the file
    fs.writeFile(
      "db.json",
      JSON.stringify({ ...db, books: newBooks }),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  });
};

module.exports = {
  find,
  bookExists,
  remove,
};
