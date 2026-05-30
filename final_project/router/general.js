const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (isValid(username)) {
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get all books
public_users.get('/', function (req, res) {

  return res.status(200).send(
    JSON.stringify(books, null, 4)
  );

});

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(
    books[isbn]
  );

});

// Get books by author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  let filteredBooks = [];

  let keys = Object.keys(books);

  keys.forEach(key => {

    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }

  });

  return res.status(200).json(filteredBooks);

});

// Get books by title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  let filteredBooks = [];

  let keys = Object.keys(books);

  keys.forEach(key => {

    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }

  });

  return res.status(200).json(filteredBooks);

});

// Get reviews
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(
    books[isbn].reviews
  );

});

// Task 10 - Get all books using async/await

public_users.get('/async/books', async (req, res) => {

  try {

    const response =
      await axios.get(
        'http://localhost:5000/'
      );

    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});

// Task 11 - Get book by ISBN using Promises

public_users.get('/async/isbn/:isbn', (req, res) => {

  const isbn = req.params.isbn;

  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {

      return res.status(200).json(response.data);

    })
    .catch((error) => {

      return res.status(500).json({
        message: error.message
      });

    });

});

// Task 12 - Get books by Author using Promises

public_users.get('/async/author/:author', (req, res) => {

  const author = req.params.author;

  axios
    .get(`http://localhost:5000/author/${author}`)
    .then((response) => {

      return res.status(200).json(response.data);

    })
    .catch((error) => {

      return res.status(500).json({
        message: error.message
      });

    });

});

// Task 13 - Get books by Title using Promises

public_users.get('/async/title/:title', (req, res) => {

  const title = req.params.title;

  axios
    .get(`http://localhost:5000/title/${title}`)
    .then((response) => {

      return res.status(200).json(response.data);

    })
    .catch((error) => {

      return res.status(500).json({
        message: error.message
      });

    });

});

module.exports.general = public_users;