const db = require("../db.json");
const fs = require("fs");

const findAll = () => {
  return new Promise((resolve, reject) => {
    resolve(db.users);
  });
};


module.exports = {
    findAll,
}