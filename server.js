"use strict";
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
server.use(cors());
server.use(express.json())

const PORT = process.env.PORT || 3000 ;

//mongoose config
mongoose.connect('mongodb://FarahEilouti:farah1234@ac-bjb772e-shard-00-00.uohp0je.mongodb.net:27017,ac-bjb772e-shard-00-01.uohp0je.mongodb.net:27017,ac-bjb772e-shard-00-02.uohp0je.mongodb.net:27017/?ssl=true&replicaSet=atlas-zx8gie-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}); // 1 - connect mongoose with DB 

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


