const { MongoClient } = require("mongodb");
require("dotenv").config();

const dbConnection = new MongoClient(process.env.dbConnectionUrl);
const dbname = process.env.dbName;

const main = async () => {
  await dbConnection.connect();
  console.log("connected to data base");

  const db = dbConnection.db(dbname);

  // * insertOne
  // const usersCollection = db.collection("users");
  // usersCollection.insertOne({
  //   name: "mmd",
  //   username: "mmd_mmdi",
  //   email: "mmd@gmail.com",
  //   crime: 30,
  //   role: "ADMIN",
  //   age: 12,
  // });

  // * insertOne
  // const booksCollection = db.collection("books");
  // booksCollection.insertOne({
  //   title: "Nodejs Book",
  //   author: "Person 1",
  //   price: 200000,
  //   free: 0,
  // });

  // * insertMany
  // const rentsCollection = db.collection("rents");
  // const result = await rentsCollection.insertMany([
  //   { userID: 1, bookID: 1 },
  //   {
  //     userID: "fc9b7cd0-173c-4f5f-9bc8-ec9c062d7379",
  //     bookID: 2,
  //   },
  // ]);
  // console.log(result);

  // * findOne || find
  // const usersCollection = db.collection("users");
  // const noCrimeUsers = await usersCollection.findOne({ crime: 0 });
  // const noCrimeUsers = await usersCollection
  //   .find({ name: "Qadir Yolme" })
  //   .toArray();
  // const mainUser = await usersCollection.findOne({
  //   _id: new ObjectId("6462043e1eb69497513287f2"),
  // });

  // const allUsers = await usersCollection.find({}).toArray();

  // const mainUser = await usersCollection.findOne({
  //   name: "Amin Saeedi",
  //   // crime: 12000,
  //   role: "ADMIN",
  // });

  // console.log(mainUser);

  // * deleteOne || deleteMany || findOneAndDelete
  // const rentsCollection = db.collection("rents");
  // const deleteResult = await rentsCollection.deleteOne({
  //   _id: new ObjectId("6462559024965d9195de01fe"),
  // });

  // const deleteResult = await rentsCollection.findOneAndDelete({
  //   _id: new ObjectId("64625a702b70b93c45422492"),
  // });

  // const deleteResult = await rentsCollection.deleteMany({ bookID: 2 });

  // console.log(deleteResult);

  // * updateOne || updateMany || findOneAndUpdate
  // const rentsCollection = db.collection("rents");
  // const result = await rentsCollection.updateOne(
  //   { userID: 1 },
  //   {
  //     $set: {
  //       bookID: 10,
  //     },
  //   }
  // );

  // const result = await rentsCollection.updateMany(
  //   { bookID: 1 },
  //   {
  //     $set: {
  //       bookID: 50,
  //       userID: 5,
  //     },
  //   }
  // );

  // const result = await rentsCollection.findOneAndUpdate(
  //   { _id: new ObjectId("6463b70ef7b82dc789e203cd") },
  //   {
  //     $set: {
  //       bookID: 100,
  //     },
  //   }
  // );

  // console.log(result.value);

  // * replaceOne || findOneAndReplace
  // const usersCollection = db.collection("users");
  // const result = await usersCollection.replaceOne(
  //   { username: "Q_Yolme" },
  //   {
  //     score: 10,
  //     name: "Qadir Yolme",
  //   }
  // );

  // const result = await usersCollection.findOneAndReplace(
  //   { role: "ADMIN" },
  //   {
  //     role: "USER",
  //     name: "Ehsan Mmdi",
  //   }
  // );

  // console.log(result);

  // * Nested Documents
  // const usersCollection = db.collection("users");
  // const result = await usersCollection.insertOne({
  //   name: "Amin Saeedi",
  //   username: "01010101",
  //   age: 23,
  //   email: "amin@gmail.com",
  //   tags: ["frontend", "backend", "seo"],
  //   address: {
  //     country: "Iran",
  //     province: "Tabriz",
  //     city: "Jolfa",
  //   },
  // });

  // const mainUser = await usersCollection.findOne({
  //   _id: new ObjectId("6465dad0ad8f690f5bfc9d8a"),
  // });

  // console.log(mainUser.address.city);

  // * filtering operaters
  // const usersCollection = db.collection("users");
  // const result = await usersCollection
  //   .find({
  //     role: { $ne: "USER" }, // $ne : evrything but $ne value
  //     role: { $eq: "AUTHOR" }, // $eq: equal
  //     crime: { $lt: 12 }, // crime < 12
  //     crime: { $lte: 12 }, // crime <= 12
  //     crime: { $gt: 12 }, // crime > 12
  //     crime: { $gte: 12 }, // crime >= 12
  //     crime: { $in: [12, 22, 35] }, // in it

  //     crime: { $nin: [12, 22, 35] }, // not in it
  //     age: 18,

  //     $or: [{ crime: { $in: [22, 12, 35] } }, { age: 18 }], // or operater
  //   })
  //   .toArray();

  // console.log(result);

  // * for droping collection
  // const booksCollection = db.collection("books");
  // const result = await booksCollection.drop();
  // const result = await db.collection("rents").drop();
  // const result = await db.dropCollection('rents')

  // * for droping database
  // const result = await db.dropDatabase();

  // * diffrent operater for update method
  // const usersCollection = db.collection("users");
  // const result = await usersCollection.updateOne(
  //   { email: "mmd@gmail.com" },
  //   {
  //     $set: {
  //       code: 12,
  //     }, // $set : for adding or updating
  //     $unset: {
  //       address: 1, // ''
  //     }, //  $unset : for deleting or droping should use 1 or ''
  //     $inc: {
  //       age: -5,
  //     }, // $inc: increse for adding ad numver
  //     $min: {
  //       age: 8,
  //     }, // $min: chose lower value
  //     $max: {
  //       age: 21,
  //     }, // $max : chose the higher value
  //     $mul: {
  //       code: 2,
  //     },
  //   }
  // );

  // console.log(result);

  // * working with array
  // const usersCollection = db.collection("users");
  // const result = await usersCollection
  //   .find({
  //     tags: "seo", // fin array that has seo as one of it item
  //     tags: ["seo"], // array most only have seo to fint it and nothing else
  //     tags: { $all: ["backend", "frontend"] }, // it most have all the item of the all
  //     tags: { $size: 3 }, // size of the array most we 3
  //   })
  //   .toArray();

  // const result = await usersCollection.updateOne(
  //   {
  //     _id: new ObjectId("6465fc73a9f46399c5f6b3fd"),
  //   },
  //   {
  //     $push: { 
  //       tags: "frontend",
  //     }, // add to array
  //     $addToSet: {
  //       tags: "backend",
  //     }, // add to array but ignor it if it already have the item iwth same name
  //     $pop: {
  //       tags: 1, // -1 | 1
  //     }, // delete first or last item
  //     $pull: {
  //       tags: "seo",
  //     }, // delete the item we give it
  //   }
  // );
  // console.log(result);

  // * limit, sort, count
  // const usersCollection = db.collection("users")
  // const result = await usersCollection.countDocuments({ crime: { $gt: 19}}); // number of the item it find throw our filterring
  // const result = await usersCollection.countDocuments({ crime: { $gt: 19}}); // number of the item it find throw our filterring
  // const result = await usersCollection.find({}).sort({ _id: 1}).toArray();  to sort data in order we want

  // console.log(result)

  return "Done";
};

main();
