const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register New User
public_users.post("/register", (req, res) => {

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

// Task 1 - Get all books
public_users.get('/', function (req, res) {

    return res.status(200).send(
        JSON.stringify(books, null, 4)
    );

});

// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(
        books[isbn]
    );

});

// Task 3 - Get books by Author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    let filteredBooks = [];

    Object.keys(books).forEach((key) => {

        if (books[key].author === author) {
            filteredBooks.push(books[key]);
        }

    });

    return res.status(200).json(filteredBooks);

});

// Task 4 - Get books by Title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    let filteredBooks = [];

    Object.keys(books).forEach((key) => {

        if (books[key].title === title) {
            filteredBooks.push(books[key]);
        }

    });

    return res.status(200).json(filteredBooks);

});

// Task 5 - Get Book Reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(
        books[isbn].reviews
    );

});


// =====================================================
// TASK 10
// Get all books using Async/Await
// =====================================================

public_users.get('/async/books', async function (req, res) {

    try {

        const bookPromise = new Promise((resolve) => {
            resolve(books);
        });

        const result = await bookPromise;

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

});


// =====================================================
// TASK 11
// Search by ISBN using Promises
// =====================================================

public_users.get('/async/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const promise = new Promise((resolve, reject) => {

        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }

    });

    promise
        .then((book) => {

            return res.status(200).json(book);

        })
        .catch((error) => {

            return res.status(404).json({
                message: error
            });

        });

});


// =====================================================
// TASK 12
// Search by Author using Promises
// =====================================================

public_users.get('/async/author/:author', function (req, res) {

    const author = req.params.author;

    const promise = new Promise((resolve) => {

        const result = Object.keys(books)
            .map(key => books[key])
            .filter(book => book.author === author);

        resolve(result);

    });

    promise
        .then((result) => {

            return res.status(200).json(result);

        })
        .catch((error) => {

            return res.status(500).json({
                message: error
            });

        });

});


// =====================================================
// TASK 13
// Search by Title using Async/Await
// =====================================================

public_users.get('/async/title/:title', async function (req, res) {

    const title = req.params.title;

    try {

        const titlePromise = new Promise((resolve) => {

            const result = Object.keys(books)
                .map(key => books[key])
                .filter(book => book.title === title);

            resolve(result);

        });

        const result = await titlePromise;

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

});

module.exports.general = public_users;
