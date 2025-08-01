const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");

const bookController = require("./controllers/bookController");
const rentController = require("./controllers/rentController");
const userController = require('./controllers/usersController')

const server = http.createServer((req, res) => {
  // Get list of users
  if (req.method === "GET" && req.url === "/api/users") {
   userController.getAll(req, res)
  }
  // for user login
  else if (req.method === "POST" && req.url === "/api/users/login") {
    let user = "";

    req.on("data", (data) => {
      user = user + data.toString();
    });

    req.on("end", () => {
      const { username, gmail } = JSON.parse(user);
      const mainUser = db.users.find(
        (user) => user.username === username && user.gmail === gmail
      );

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
  }
  // Add user
  else if (req.method === "POST" && req.url === "/api/users") {
    let NewUserInfo = "";

    req.on("data", (data) => {
      NewUserInfo = NewUserInfo + data.toString();
    });

    req.on("end", () => {
      const { name, username, gmail } = JSON.parse(NewUserInfo);
      const isUserExist = db.users.find(
        (user) => user.gmail === gmail || user.username === username
      );
      //cheak if data is empty
      if (name === "" || username === "" || gmail === "") {
        res.writeHead(422, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "User Data are not valid" }));
        res.end();
      }
      // cheack if the use exist
      else if (isUserExist) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({ message: "Email or Username alredy exist" })
        );
        res.end();
      }
      // make user if there is no problem
      else {
        // return the highest value id in data base
        const lastId = db.users.reduce(
          (max, book) => (book.id > max ? book.id : max),
          0
        );
        const newUser = {
          id: lastId + 1,
          name,
          username,
          gmail,
          crime: 0,
          role: "USER",
        };
        db.users.push(newUser);

        fs.writeFile("./db.json", JSON.stringify(db), (err) => {
          if (err) {
            throw err;
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "User register successfully" }));
          res.end();
        });
      }
    });
  }
  // make user admin
  else if (req.method === "PUT" && req.url.startsWith("/api/users/update")) {
    const parseUrl = url.parse(req.url, true);
    const userId = parseUrl.query.id;

    db.users.forEach((user) => {
      if (user.id === Number(userId)) {
        user.role = "ADMIN";
      }
    });

    fs.writeFile("./db.json", JSON.stringify(db), (err) => {
      if (err) {
        throw err;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "user updated to admin" }));
      res.end();
    });
  }
  // User crime update
  else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
    const parseUrl = url.parse(req.url, true);
    const userId = parseUrl.query.id;

    let updatedUser = "";

    req.on("data", (data) => {
      updatedUser = updatedUser + data.toString();
    });

    req.on("end", () => {
      const { crime } = JSON.parse(updatedUser);

      db.users.forEach((user) => {
        if (user.id === Number(userId)) {
          user.crime = crime;
        }
      });

      fs.writeFile("./db.json", JSON.stringify(db), (err) => {
        if (err) {
          throw err;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({ message: "User crime updated successfully" })
        );
        res.end();
      });
    });
  }
  // Get list of books
  else if (req.method === "GET" && req.url === "/api/books") {
    bookController.getAll(req, res);
  }
  // Add new book
  else if (req.method === "POST" && req.url === "/api/books") {
    bookController.addOne(req, res);
  }
  // return book
  else if (req.method === "PUT" && req.url.startsWith("/api/rent/back")) {
    rentController.returnBook(req, res);
  }
  // renting book
  else if (req.method === "POST" && req.url === "/api/rent") {
    rentController.rent(req, res);
  }
  // Delete a book by id
  else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
    bookController.removeOne(req, res);
  }
  // Edit a Book
  else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
    bookController.editBook(req, res);
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
