const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // ide kerülnek a regisztrált felhasználók

// Ellenőrzi, hogy a felhasználónév létezik-e
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Ellenőrzi, hogy a felhasználónév és jelszó páros érvényes-e
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login végpont
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Felhasználónév és jelszó kötelező!" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Érvénytelen felhasználónév vagy jelszó!" });
    }

    // JWT létrehozása
    const token = jwt.sign({ username: username }, "fingerprint_customer", { expiresIn: '1h' });

    // Session-be mentés (feltételezve, hogy az index.js-ben express-session be van állítva)
    req.session.user = { username: username, token: token };

    // Visszatérés sikeres üzenettel és tokennel
    return res.status(200).json({ 
        message: "Sikeres bejelentkezés!", 
        token: token 
    });
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // Ellenőrizzük, hogy a könyv létezik-e
    if (!books[isbn]) {
        return res.status(404).json({ message: "Nincs könyv ezzel az ISBN-nel." });
    }

    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    if (!req.session.user || !req.session.user.username) {
        return res.status(401).json({ message: "Bejelentkezés szükséges a review hozzáadásához." });
    }

    const username = req.session.user.username;

    // Hozzáadjuk vagy módosítjuk az értékelést
    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
        message: "Értékelés sikeresen hozzáadva/módosítva.",
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Ellenőrizzük, hogy a könyv létezik-e
    if (!books[isbn]) {
        return res.status(404).json({ message: "Nincs könyv ezzel az ISBN-nel." });
    }

    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    if (!req.session.user || !req.session.user.username) {
        return res.status(401).json({ message: "Bejelentkezés szükséges a review törléséhez." });
    }

    const username = req.session.user.username;

    // Ellenőrizzük, hogy a felhasználóhoz tartozik-e értékelés
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Nincs értékelésed ennél a könyvnél." });
    }

    // Töröljük a felhasználó értékelését
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Értékelés sikeresen törölve.",
        reviews: books[isbn].reviews
    });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
