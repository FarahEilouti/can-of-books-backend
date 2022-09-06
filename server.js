"use strict";
const express = require("express"); 
const server = express();
const cors = require("cors");
server.use(cors());

server.use(express.json())
require("dotenv").config();

const mongoose = require("mongoose");

const PORT = process.env.PORT;

//mongoose config
mongoose.connect("mongodb://localhost:27017/booksDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

const booksSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

const bookModel = mongoose.model("book", booksSchema); 

// http://lovalhost/:port/books
server.get("/books", getbooksHandler);
server.post('/addBook', getAddBookHandler);
server.delete('/deleteBook/:id',deleteBookHandler)

function getbooksHandler(req, res) {
  bookModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}


async function getAddBookHandler(req,res){
    // console.log(req.body)
    const {bookTitle,bookDescription,bookStatus} = req.body
    await bookModel.create({
      title: bookTitle,
      description: bookDescription,
      status: bookStatus,
    })
    bookModel.find({},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
}


function deleteBookHandler(req,res){
  const bookId = req.params.id;
  bookModel.deleteOne({_id:bookId},(err,result)=>{

    bookModel.find({},(err,result)=>{
          if(err){
              console.log(err)
          }
          else{
              res.send(result)
          }
      })
  })
}

// http://localhost/:
server.get("/", (req, res) => {
  //path
  res.send("route is runing");
});

server.listen(PORT, () => {
  console.log(`you run this PORT: ${PORT}`);
});


