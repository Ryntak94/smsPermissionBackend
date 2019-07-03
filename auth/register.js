const bcrypt = require("bcryptjs");
const db = require("../dbConfig");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();


// const { authenticate } = require("./authenticate");

router.post("/register", (req, res) => {
  // implement user registration
  const user = req.body;
  if (!user.email || !user.password) {
    res
      .status(400)
      .json({ message: "bad request email and password required" });
  } else {
    user.password = bcrypt.hashSync(user.password, 8);
    db("teachers")
      .insert(user)
      .then(id => {
        token = generateToken(id[0]);
        res.status(201).json({ id: id[0], token: token });
      })
      .catch(err => {
        res.status(500).json({ message:  err.message });
      });
  }
});

router.post("/login", (req, res) => {
  // implement user login
  const creds = req.body;
  if (!creds.email || !creds.password) {
    res.status(400).json({ message: "email and password required" });
  } else {
    db("teachers")
      .where({ email: creds.email })
      .first()
      .then(user => {
        if (creds.email && bcrypt.compareSync(creds.password, user.password)) {
          const token = generateToken(user.id);
          res.status(200).json({ id: user.id, token: token });
        } else {
          res.status(401).json({ message: "invalid credentials" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "internal error logging in" });
      });
  }
});

function generateToken(id) {
  const payload = {
    subject: id
  };
  const options = {
    expiresIn: "7d"
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
module.exports = router;
