const http = require("http");
require('dotenv').config()
console.log(process.env.PORT)

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
    userController.login(req, res)
  }
  // Add user
  else if (req.method === "POST" && req.url === "/api/users") {
    userController.register(req, res)
  }
  //delete user
  else if (req.method === "DELETE" && req.url.startsWith("/api/users")) {
    userController.deleteUser(req, res)
  }
  // make user admin
  else if (req.method === "PUT" && req.url.startsWith("/api/users/update")) {
    userController.makeAdmin(req, res)
  }
  // User crime update
  else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
    userController.userCrimeUpdate(req, res)
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

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
