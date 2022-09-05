"use strict";
const express = require("express"); // import express farmework
const server = express();
const cors = require("cors");
server.use(cors());

require("dotenv").config();

const mongoose = require("mongoose");

const PORT = process.env.PORT;

//mongoose config
mongoose.connect("mongodb://localhost:27017/booksDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // 1 - connect mongoose with DB

const booksSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

const bookModel = mongoose.model("book", booksSchema); //compile the schema iont a model

//seed data (insert initial data)

async function seedData() {
  const firstBook = new bookModel({
    title: "Catching Fire",
    description: "Catching Fire is a 2009 science fiction young adult novel by the American novelist Suzanne Collins, the second book in The Hunger Games series.",
    status: "Available",
  });
  const secondBook = new bookModel({
    title: "Harry Potter and the Philosopher's Stone",
    description: "",
    status: "Available",
  });
  const thirdBook = new bookModel({
    title: "Coveting Her",
    description: "A short MC second chance romance with a man who is all alpha reunites with the woman who got away.",
    status: "Available",
  });

  await firstBook.save();
  await secondBook.save();
  await thirdBook.save();
}

// seedData();

// http://lovalhost/:port/books
server.get("/books", getbooksHandler);

function getbooksHandler(req, res) {
  bookModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result)
      res.send(result);
    }
  });
}

// http://localhost/:
server.get("/", (req, res) => {
  //path
  res.send("route is runing");
});

server.listen(PORT, () => {
  console.log(`you run this PORT: ${PORT}`);
});


