const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session beállítás a /customer útvonalon
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Auth middleware a /customer/auth/* útvonalakhoz
app.use("/customer/auth/*", function auth(req, res, next){
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Hozzáférési token hiányzik!" });
  }

  // Token ellenőrzése
  jwt.verify(token, "fingerprint_customer", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Érvénytelen token!" });
    }

    // Session létrehozása / frissítése
    req.session.user = user;

    // Tovább a következő middleware-re / route-ra
    next();
  });
});

const PORT = 5000;

// Route-ok
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
