const db = require("../db.json");
const fs = require("fs");
const rentModel = require("./../models/Rent");

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

const add = (body) => {
  return new Promise((resolve, reject) => {
    db.books.push(body);
    fs.writeFile("db.json", JSON.stringify(db), (err) => {
      if (err) {
        throw err;
      }
    });
  });
};

const lastId = () => {
  return new Promise((resolve, reject) => {
    resolve(db.books.reduce((max, book) => (book.id > max ? book.id : max), 0));
  });
};

const isFree = (bookId) => {
  return new Promise((resolve, reject) => {
    resolve(db.books.some((book) => book.id === bookId && book.free === 1));
  });
};

const rent = (BookId) => {
  return new Promise((resolve, reject) => {
    resolve(
      db.books.forEach((book) => {
        if (book.id === Number(BookId)) {
          book.free = 0;
        }
      })
    );
  });
};

const findOne = (bookId) => {
  return new Promise((resolve, reject) => {
    resolve(db.books.find((b) => b.id === Number(bookId)));
  });
};


module.exports = {
  find,
  bookExists,
  remove,
  add,
  lastId,
  isFree,
  rent,
  findOne,
};
