const db = require("../db.json");
const fs = require("fs");
const { dbConnection } = require("./../configs/db");
const { ObjectId } = require("mongodb");

const findAll = async () => {
  const db = await dbConnection();
  const usersCollection = db.collection("users");
  const result = usersCollection.find({}).toArray();
  return result;
  // return new Promise((resolve, reject) => {
  //   resolve(db.users);
  // });
};

const findByUsernameAndGmail = async (username, gmail) => {
  const db = await dbConnection();
  const usersCollection = db.collection("users");
  const result = usersCollection.findOne({
    username: username,
    gmail: gmail,
  });
  return result;
  // return new Promise((resolve, reject) => {
  //   const mainUser = db.users.find(
  //     (user) => user.username === username && user.gmail === gmail
  //   );
  //   resolve(mainUser);
  // });
};

const isUserExist = async (username, gmail) => {
  const db = await dbConnection()
  const usersCollection = db.collection('users')
  const result = !!(await usersCollection.findOne({
    username,
    gmail
  }))
  console.log(result)
  return result;
  // return new Promise((resolve, reject) => {
  //   const isUserExist = db.users.find(
  //     (user) => user.username === username || user.gmail === gmail
  //   );
  //   resolve(isUserExist);
  // });
};

const isUserExistById = async (userId) => {
  const db = await dbConnection()
  const usersCollection = db.collection('users')
  const result = !!(await usersCollection.findOne({_id: new ObjectId(userId)}))
  return result
  // return new Promise((resolve, reject) => {
  //   const isUserExist = db.users.find((user) => user.id === Number(userId));
  //   resolve(isUserExist);
  // });
};

// const lastId = () => {
//   return new Promise((resolve, reject) => {
//     const lastId = db.users.reduce(
//       (max, book) => (book.id > max ? book.id : max),
//       0
//     );
//     resolve(lastId);
//   });
// };

const createUser = async (user) => {
  const db = await dbConnection()
  const usersCollection = db.collection('users')
  await usersCollection.insertOne({
    ...user,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  // return new Promise((resolve, reject) => {
  //   db.users.push(user);
  //   fs.writeFile("./db.json", JSON.stringify(db), (err) => {
  //     if (err) {
  //       throw reject(err);
  //     }
  //     resolve();
  //   });
  // });
};

const deleteUser = async (userId) => {
  const db = await dbConnection()
  const usersCollection = db.collection('users')
  await usersCollection.deleteOne({_id: new ObjectId(userId)})

  // return new Promise((resolve, reject) => {
  //   const newUser = db.users.filter((user) => user.id != userId);

  //   // Write the updated data back to the file
  //   fs.writeFile(
  //     "db.json",
  //     JSON.stringify({ ...db, users: newUser }),
  //     (err) => {
  //       if (err) {
  //         throw reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

const makeAdmin = async (userId) => {
  const db = await dbConnection()
  const usersCollection = db.collection('users')
  await usersCollection.updateOne({_id: new ObjectId(userId)}, {
    $set:{
      role: "ADMIN"
    }
  })
  // return new Promise((resolve, reject) => {
  //   db.users.forEach((user) => {
  //     if (user.id === Number(userId)) {
  //       user.role = "ADMIN";
  //     }
  //   });

  //   fs.writeFile("./db.json", JSON.stringify(db), (err) => {
  //     if (err) {
  //       throw reject(err);
  //     }
  //     resolve();
  //   });
  // });
};

const updateUserCrime = async (userId, crime) => {
  const db = await dbConnection()
  const usersCollection = db.collection('users')
  await usersCollection.updateOne({_id: new ObjectId(userId)}, {
    $set:{
      crime: crime
    }
  })
  // return new Promise((resolve, reject) => {
  //   db.users.forEach((user) => {
  //     if (user.id === Number(userId)) {
  //       user.crime = crime;
  //     }
  //   });

  //   fs.writeFile("./db.json", JSON.stringify(db), (err) => {
  //     if (err) {
  //       throw reject(err);
  //     }
  //     resolve();
  //   });
  // });
};

module.exports = {
  findAll,
  findByUsernameAndGmail,
  isUserExist,
  isUserExistById,
  // lastId,
  createUser,
  deleteUser,
  makeAdmin,
  updateUserCrime,
};
