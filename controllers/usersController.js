const userModels = require("../models/User");

const getAll = async (req, res) => {
  const users = await userModels.findAll();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(users));
  res.end();
};


module.exports = {
    getAll,
}
    

