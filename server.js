const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");

const server = http.createServer((req, res) => {
  // Get list of users
  if (req.url === "/api/users" && req.method === "GET") {
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

  // Get list of books
  else if (req.url === "/api/books" && req.method === "GET") {
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
