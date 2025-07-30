const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");

const bookController = require("./controllers/bookController")

const server = http.createServer((req, res) => {
  // Get list of users
  if (req.method === "GET" && req.url === "/api/users") {
    fs.readFile("db.json", (err, db) => {
      if (err) {
        throw err;
      }
      const data = JSON.parse(db);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data.users));
      res.end();
    });
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
   bookController.getAll(req, res)
  }
  // Add new book
  else if (req.method === "POST" && req.url === "/api/books") {
    let book = "";

    req.on("data", (data) => {
      book = book + data.toString();
    });
    req.on("end", () => {
      // return the highest value id in data base
      const lastId = db.books.reduce(
        (max, book) => (book.id > max ? book.id : max),
        0
      );
      const newBook = {
        id: lastId + 1,
        ...JSON.parse(book),
        free: 1,
      };
      db.books.push(newBook);
      fs.writeFile("db.json", JSON.stringify(db), (err) => {
        if (err) {
          throw err;
        }
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "New Book Added successfully" }));
        res.end();
      });
    });
  } // renting book
  else if (req.method === "POST" && req.url === "/api/books/rent") {
    let reqBody = "";

    req.on("data", (data) => {
      reqBody = reqBody + data.toString();
    });

    req.on("end", () => {
      let { userId, bookId } = JSON.parse(reqBody);
      console.log(bookId);

      const isFreeBook = db.books.some(
        (book) => book.id === bookId && book.free === 1
      );

      if (isFreeBook) {
        db.books.forEach((book) => {
          if (book.id === Number(bookId)) {
            book.free = 0;
          }
        });
        // return the highest value id in data base
        const lastId = db.rents.reduce(
          (max, book) => (book.id > max ? book.id : max),
          0
        );
        const newRent = {
          id: lastId + 1,
          userId,
          bookId,
        };

        db.rents.push(newRent);

        fs.writeFile("./db.json", JSON.stringify(db), (err) => {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "book has rented" }));
          res.end();
        });
      } else {
        res.writeHead(301, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "book not available" }));
        res.end();
      }
    });
  }
  // Delete a book by id
  else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
   bookController.removeOne(req,res)
  }
  // Edit a Book
  else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
    const parseUrl = url.parse(req.url, true);
    const bookId = parseUrl.query.id;

    let bookNewInfo = "";

    // Check if the book with the given id exists
    const bookExists = db.books.some((book) => book.id == bookId);

    if (!bookExists) {
      // If not found, return 404 error
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Book not found" }));
      return res.end();
    }

    req.on("data", (data) => {
      bookNewInfo = bookNewInfo + data.toString();
    });

    req.on("end", () => {
      const reqBody = JSON.parse(bookNewInfo);

      db.books.forEach((book) => {
        if (book.id === Number(bookId)) {
          book.title = reqBody.title;
          book.author = reqBody.author;
          book.price = reqBody.price;
        }
      });

      fs.writeFile("./db.json", JSON.stringify(db), (err) => {
        if (err) {
          throw err;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "book change successfully" }));
        res.end();
      });
    });
  }
  // return book
  else if (req.method === "PUT" && req.url.startsWith("/api/books/back")) {
    const parseUrl = url.parse(req.url, true);
    const bookId = parseUrl.query.id;

    const newRents = db.rents.filter((rent) => rent.bookId != bookId);

    const book = db.books.find((b) => b.id === Number(bookId));
    if (book) {
      book.free = 1;

      fs.writeFile(
        "./db.json",
        JSON.stringify({ ...db, rents: newRents }),
        (err) => {
          if (err) {
            throw err;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "book has returned" }));
          res.end();
        }
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Book not found" }));
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
