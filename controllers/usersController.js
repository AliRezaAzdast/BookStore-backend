const url = require("url");
const userModels = require("../models/User");

const getAll = async (req, res) => {
  const users = await userModels.findAll();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(users));
  res.end();
};

const login = async (req, res) => {
  let user = "";

  req.on("data", (data) => {
    user = user + data.toString();
  });

  req.on("end", async () => {
    const { username, gmail } = JSON.parse(user);
    const mainUser = await userModels.findByUsernameAndGmail(username, gmail);
    console.log(mainUser)
    if (mainUser) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "User has logedin" }));
      res.end();
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "User not found" }));
      res.end();
    }
  });
};

const register = async (req, res) => {
  let NewUserInfo = "";

  req.on("data", (data) => {
    NewUserInfo = NewUserInfo + data.toString();
  });
  req.on("end", async () => {
    const { name, username, gmail } = JSON.parse(NewUserInfo);
    const isUserExist = await userModels.isUserExist(username, gmail);
    //cheak if data is empty
    if (name === "" || username === "" || gmail === "") {
      res.writeHead(422, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "User Data are not valid" }));
      res.end();
    }
    // cheack if the use exist
    else if (isUserExist) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Email or Username alredy exist" }));
      res.end();
    }
    // make user if there is no problem
    else {
      // return the highest value id in data base

      const newUser = {
        name,
        username,
        gmail,
        crime: 0,
        role: "USER",
      };
      await userModels.createUser(newUser);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "User register successfully" }));
      res.end();
    }
  });
};

const deleteUser = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const userId = parseUrl.query.id;
  const isUserExist = await userModels.isUserExistById(userId);
  if (!isUserExist) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "User not found" }));
    return res.end();
  }
  await userModels.deleteUser(userId);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ message: "User deleted successfully" }));
  res.end();
};

const makeAdmin = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const userId = parseUrl.query.id;
  await userModels.makeAdmin(userId);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ message: "user updated to admin" }));
  res.end();
};

const userCrimeUpdate = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const userId = parseUrl.query.id;

  let updatedUser = "";

  req.on("data", (data) => {
    updatedUser = updatedUser + data.toString();
  });

  req.on("end", async () => {
    const { crime } = JSON.parse(updatedUser);
    await userModels.updateUserCrime(userId, crime);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "User crime updated successfully" }));
    res.end();
  });
};

module.exports = {
  getAll,
  login,
  register,
  deleteUser,
  makeAdmin,
  userCrimeUpdate,
};
