const db = require("../db.json");
const fs = require("fs");
const { dbConnection } = require("./../configs/db");
const { ObjectId } = require("mongodb");

// const lastId = () => {
//   return new Promise((resolve, reject) => {
//     resolve(db.rents.reduce((max, book) => (book.id > max ? book.id : max), 0));
//   });
// };

const rent = async (newRent) => {
  const db = await dbConnection();
  const rentCollection = db.collection("rent");
  const { userId, bookId } = newRent;
  const addOne = rentCollection.insertOne({
    userId,
    bookId,
  });
  return addOne;

  // return new Promise((resolve, reject) => {
  //   db.rents.push(newRent);

  //   fs.writeFile("./db.json", JSON.stringify(db), (err) => {
  //     if (err) {
  //       throw err;
  //     }
  //   });
  // });
};


const remove = async (bookId) => {
  const db = await dbConnection();
  const rentCollection = db.collection("rent");
  const removeOne = rentCollection.deleteOne({bookId})
};

const rentExists = async (bookId) => {
  const db = await dbConnection();
  const rentCollection = db.collection("rent");
  const result = !!(await rentCollection.findOne({bookId}))
  return result
  // return new Promise((resolve, reject) => {
  //   resolve(db.rents.some((rent) => rent.bookId == bookId));
  // });
};

module.exports = {
  // lastId,
  rent,
  remove,
  rentExists,
};
