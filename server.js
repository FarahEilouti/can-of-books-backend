"use strict";
const express = require("express");
const server = express();
const cors = require("cors");
server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
require("dotenv").config();

const mongoose = require("mongoose");

const PORT = process.env.PORT;

// mongoose config
mongoose.connect(`${process.env.URL_MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const booksSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  email:String,
  name:String
});

const bookModel = mongoose.model("book", booksSchema);

// http://localhost:port/books
server.get("/books/:email", getbooksHandler);
server.post("/addBook/:email", getAddBookHandler);
server.delete("/deleteBook/:id/:email", deleteBookHandler);
server.put("/updateBook/:id/:email", updateBookHandler);

function getbooksHandler(req, res) {
  let email = req.params.email;
  bookModel.find({email:email}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

async function getAddBookHandler(req, res) {
  console.log(req.body)
  const { bookTitle, bookDescription, bookStatus , email, name } = req.body;
  await bookModel.create({
    title: bookTitle,
    description: bookDescription,
    status: bookStatus,
    email:email,
    name:name
  });
  bookModel.find({email:email}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

function deleteBookHandler(req, res) {
  const bookId = req.params.id;
  let email = req.params.email;
  bookModel.deleteOne({ _id: bookId }, (err, result) => {
    bookModel.find({email:email}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}

function updateBookHandler(req, res) {
  const id = req.params.id;
  let email = req.params.email;
  const {title, description, status} = req.body; //Destructuring assignment
  bookModel.findByIdAndUpdate(
    id,
    { title, description, status },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        bookModel.find({email:email}, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        });
      }
    }
  );
}

// http://localhost:
server.get("/", (req, res) => {
  //path
  res.send("route is runing");
});
server.get("*", (req, res) => {
  //path
  res.send("Page not found. You might not have permissions to see this page.");
});

server.listen(PORT, () => {
  console.log(`you run this PORT: ${PORT}`);
});