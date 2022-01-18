const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {getUserByColumn} = require('./helpers/user-helpers');
// curl -X POST -d 'password=password' -d 'email=test@example.com' http://localhost:3002/api/login

//Default route is /api/login
module.exports = (db) => {
  app.post('/', (req, res) => {

    console.log(req.body);

    const { password, email } = req.body;
    getUserByColumn('email', email, db)
    .then(resp => {
      if (resp) {
      bcrypt.compare(password, resp.password_digest, function (err, result) {

        if (result) {
          console.log("success!")

          // Generate an access token
          const accessToken = jwt.sign({user_id: resp.id, user_email: resp.email} , process.env.JWT_SECRET);
          return res.send({status: 200, spector_jwt: accessToken})
        } else {
          return res.send({status: 401, message: "bad password"})
        }
      })
      } else {
        return res.send({status: 401, message: "user not found"})
      }
    }).catch(err => {
      console.log("HERE")
      console.log(err);
    })

  });


return app;
}
