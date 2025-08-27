const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Ellenőrzés: van-e username és password
  if (!username || !password) {
    return res.status(400).json({ message: "Felhasználónév és jelszó kötelező!" });
  }

  // Ellenőrzés: létezik-e már ilyen user
  let userExists = users.filter((user) => user.username === username).length > 0;
  if (userExists) {
    return res.status(409).json({ message: "A felhasználónév már létezik!" });
  }

  // Ha nem létezik, hozzuk létre
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "Sikeres regisztráció! Most már bejelentkezhetsz." });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;     // paraméterből ISBN
  const book = books[isbn];         // a booksdb objektumból lekérjük

  if (book) {
    return res.send(JSON.stringify(book, null, 4)); // szépen formázott JSON
  } else {
    return res.status(404).json({ message: "Könyv nem található ezzel az ISBN-nel." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;       // a kliens által megadott szerző
  const keys = Object.keys(books);        // az összes könyv azonosítója
  let results = [];                       // ide gyűjtjük a találatokat

  keys.forEach((key) => {
    if (books[key].author === author) {
      results.push({ isbn: key, ...books[key] });
    }
  });

  if (results.length > 0) {
    return res.send(JSON.stringify(results, null, 4)); // szép JSON formátum
  } else {
    return res.status(404).json({ message: "Nem található könyv ettől a szerzőtől." });
  }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;       // a kliens által megadott cím
  const keys = Object.keys(books);      // az összes könyv azonosítója
  let results = [];                     // ide gyűjtjük a találatokat

  keys.forEach((key) => {
    if (books[key].title === title) {
      results.push({ isbn: key, ...books[key] });
    }
  });

  if (results.length > 0) {
    return res.send(JSON.stringify(results, null, 4)); // szép JSON kimenet
  } else {
    return res.status(404).json({ message: "Nem található könyv ezzel a címmel." });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;   // ISBN kiolvasása a request paraméterből

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4)); 
  } else {
    return res.status(404).json({ message: "Nincs könyv ezzel az ISBN-nel." });
  }
});

module.exports.general = public_users;
