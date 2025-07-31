const db = require("../db.json");
const fs = require("fs");

const lastId = () => {
  return new Promise((resolve, reject) => {
    resolve(db.rents.reduce((max, book) => (book.id > max ? book.id : max), 0));
  });
};

const rent = (newRent) => {
  return new Promise((resolve, reject) => {
    db.rents.push(newRent);

    fs.writeFile("./db.json", JSON.stringify(db), (err) => {
      if (err) {
        throw err;
      }
    });
  });
};

const filter = (rentId) => {
  return new Promise((resolve, reject) => {
    resolve(db.rents.filter((rent) => rent.bookId != Number(rentId)));
  });
};

const remove = (body) => {
  return new Promise((resolve, reject) => {
    resolve(
      fs.writeFile(
        "./db.json",
        JSON.stringify({ ...db, rents: body }),
        (err) => {
          if (err) {
            throw err;
          }
        }
      )
    );
  });
};

const rentExists = (bookId) => {
  return new Promise((resolve, reject) => {
    resolve(db.rents.some((rent) => rent.bookId == bookId));
  });
};

module.exports = {
  lastId,
  rent,
  filter,
  remove,
  rentExists
};
