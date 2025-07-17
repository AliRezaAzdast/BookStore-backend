const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // api to see users
  if (req.url === "/api/users" && req.method === "GET") {
    fs.readFile("db.json", (err, db) => {
      if (err) {
        throw err;
      } else {
        const data = JSON.parse(db);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data.users));
        res.end();
      }
    });
  }

  // api to see books
  if (req.url === "/api/books" && req.method === "GET") {
    fs.readFile("db.json", (err, db) => {
      if (err) {
        throw err;
      } else {
        const data = JSON.parse(db);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data.books));
        res.end();
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
