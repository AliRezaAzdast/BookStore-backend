const db = require("../db.json");
const fs = require("fs");

const findAll = () => {
  return new Promise((resolve, reject) => {
    resolve(db.users);
  });
};

const findByUsernameAndGmail = (username, gmail) => {
  return new Promise((resolve, reject) => {
    const mainUser = db.users.find(
      (user) => user.username === username && user.gmail === gmail
    );
    resolve(mainUser);
  });
};
const isUserExist = (username, gmail) => {
  return new Promise((resolve, reject) => {
    const isUserExist = db.users.find(
      (user) => user.username === username || user.gmail === gmail
    );
    resolve(isUserExist);
  });
};
const isUserExistById = (userId) => {
  return new Promise((resolve, reject) => {
    const isUserExist = db.users.find((user) => user.id === Number(userId));
    resolve(isUserExist);
  });
};

const lastId = () => {
  return new Promise((resolve, reject) => {
    const lastId = db.users.reduce(
      (max, book) => (book.id > max ? book.id : max),
      0
    );
    resolve(lastId);
  });
};

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    db.users.push(user);
    fs.writeFile("./db.json", JSON.stringify(db), (err) => {
      if (err) {
        throw reject(err);
      }
      resolve();
    });
  });
};

const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const newUser = db.users.filter((user) => user.id != userId);

    // Write the updated data back to the file
    fs.writeFile(
      "db.json",
      JSON.stringify({ ...db, users: newUser }),
      (err) => {
        if (err) {
          throw reject(err);
        }
        resolve();
      }
    );
  });
};

const makeAdmin = (userId) => {
  return new Promise((resolve, reject) => {
    db.users.forEach((user) => {
      if (user.id === Number(userId)) {
        user.role = "ADMIN";
      }
    });

    fs.writeFile("./db.json", JSON.stringify(db), (err) => {
      if (err) {
        throw reject(err);
      }
      resolve();
    });
  });
};

const updateUserCrime = (userId, crime) => {
  return new Promise((resolve, reject) => {
    db.users.forEach((user) => {
      if (user.id === Number(userId)) {
        user.crime = crime;
      }
    });

    fs.writeFile("./db.json", JSON.stringify(db), (err) => {
      if (err) {
        throw reject(err);
      }
      resolve();
    });
  });
};
module.exports = {
  findAll,
  findByUsernameAndGmail,
  isUserExist,
  isUserExistById,
  lastId,
  createUser,
  deleteUser,
  makeAdmin,
  updateUserCrime,
};
