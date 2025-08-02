const { MongoClient } = require("mongodb");
require('dotenv').config()

const dbConnection = new MongoClient(process.env.dbConnectionUrl);
const dbname = process.env.dbName;

const main = async () => {
  await dbConnection.connect();
  console.log("connected to data base");

  const db = dbConnection.db(dbname);

//   const usersCollection = db.collection("users");
//   usersCollection.insertOne({
//     name: "Ehsan Mmdi",
//     username: "ehs",
//     gmail: "test@gmail.com",
//     crime: 20000,
//     role: "USER",
//   });

// const booksCollection = db.collection("books")
// booksCollection.insertOne({
//   "title": "the wolf",
//   "author": "k.tolnoe",
//   "price": 30000,
//   "free": 0
// })

// const rentCollection = db.collection('rent')
// rentCollection.insertOne({
//     "userId": 1,
//     "bookId": 5
// })
  return "Done";
};

main();
