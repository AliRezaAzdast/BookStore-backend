const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");

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
        const newUser = {
          id: crypto.randomUUID(),
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
    fs.readFile("db.json", (err, db) => {
      if (err) {
        throw err;
      }
      const data = JSON.parse(db);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data.books));
      res.end();
    });
  }

  // Delete a book by id
  else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
    const parseUrl = url.parse(req.url, true);
    const bookId = parseUrl.query.id;

    // Check if the book with the given id exists
    const bookExists = db.books.some((book) => book.id == bookId);

    if (!bookExists) {
      // If not found, return 404 error
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Book not found" }));
      return res.end();
    }

    // If found, remove the book from the list
    const newBooks = db.books.filter((book) => book.id != bookId);

    // Write the updated data back to the file
    fs.writeFile(
      "db.json",
      JSON.stringify({ ...db, books: newBooks }),
      (err) => {
        if (err) {
          throw err;
        }

        // Return success response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Book removed successfully" }));
        res.end();
      }
    );
  }

  // Add new book
  else if (req.method === "POST" && req.url === "/api/books") {
    let book = "";

    req.on("data", (data) => {
      book = book + data.toString();
    });
    req.on("end", () => {
      const newBook = {
        id: crypto.randomUUID(),
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
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
