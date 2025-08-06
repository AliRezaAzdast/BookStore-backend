const url = require("url");
const BookModel = require("../models/Book");
const RentModel = require("../models/Rent");

const rent = async (req, res) => {
  let reqBody = "";

  req.on("data", (data) => {
    reqBody = reqBody + data.toString();
  });

  req.on("end", async () => {
    let { userId, bookId } = JSON.parse(reqBody);

    const isFreeBook = await BookModel.isFree(bookId);
    if (isFreeBook) {
      BookModel.rent(bookId);
      // return the highest value id in data base

      const newRent = {
        userId,
        bookId,
      };

      RentModel.rent(newRent);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "book has rented" }));
      res.end();
    } else {
      res.writeHead(301, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "book not available" }));
      res.end();
    }
  });
};

const returnBook = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const bookId = parseUrl.query.id;


  const rentExists = await RentModel.rentExists(bookId);
  if (rentExists) {
    await BookModel.returnBook(bookId)
    await RentModel.remove(bookId);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "book has returned" }));
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "rented Book not found" }));
  }
};

module.exports = {
  rent,
  returnBook,
};
