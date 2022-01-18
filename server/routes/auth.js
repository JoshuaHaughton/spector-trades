const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  app.post('/', (req, res) => {
    if (!req.body.jwt_token) {
      return res.send({status: 403, message: "missing jwt token"});
    }
    console.log(req.body);
    const token = req.body.jwt_token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log("authorized user: ", user);
        return res.status(200).send({success: true, token});
    });
  });


return app;
}

const checkEmail = function(email, db) {
  return db.query(
    `
    SELECT * FROM users
    WHERE email = $1;
    `, [ email ])
    .then(response => {
    return response.rows[0];
  }).catch(err => {
    console.log("ERROR in checkEmail", err.message);
  });
}
