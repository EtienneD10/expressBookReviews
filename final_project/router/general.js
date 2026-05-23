const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// task 6 - register a user
public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// task 1 - get all books
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books,null,4));
});

//Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  const isbn = req.params.isbn
  res.send(books[isbn])
 });
  
//task 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  const matchingBooks = bookKeys
  .filter(key => books[key].author === author)
  .map(key => books[key]);

  res.send(matchingBooks)
});

//Task 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingTitle = bookKeys
  .filter(key => books[key].title === title)
  .map(key => books[key])

  res.send(matchingTitle)
});

// task 5 - Get book reviews
public_users.get('/review/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

/* =========================
   Tasks 10–13 (Async / Axios)
   ========================= */


// Task 10 - Get all books using async/await
public_users.get('/async/books', async function(req,res){

  try{

    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);

  }catch(error){
    return res.status(500).json({message:error.message});
  }

});



// Task 11 - Get book by ISBN using Promises
public_users.get('/async/isbn/:isbn',(req,res)=>{

  const isbn = req.params.isbn;

  axios.get("http://localhost:5000/")
  .then(response => {

    const books = response.data;
    return res.status(200).json(books[isbn]);

  })
  .catch(error => {
    return res.status(500).json({message:error.message});
  });

});



// Task 12 - Get books by Author using async
public_users.get('/async/author/:author', async function(req,res){

  const author = req.params.author;

  try{

    const response = await axios.get("http://localhost:5000/");

    const filtered_books = Object.values(response.data)
      .filter(book => book.author === author);

    return res.status(200).json(filtered_books);

  }catch(error){
    return res.status(500).json({message:error.message});
  }

});



// Task 13 - Get books by Title using async
public_users.get('/async/title/:title', async function(req,res){

  const title = req.params.title;

  try{

    const response = await axios.get("http://localhost:5000/");

    const filtered_books = Object.values(response.data)
      .filter(book => book.title === title);

    return res.status(200).json(filtered_books);

  }catch(error){
    return res.status(500).json({message:error.message});
  }

});


module.exports.general = public_users;
