const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');

// curl -X POST -d 'password=password' -d 'email=test@example.com' http://localhost:3002/api/login

//Default route is /api/login
module.exports = (db) => {
  app.post('/', (req, res) => {

    console.log(req.body);

    const { password, email } = req.body;
    checkEmail(email, db)
    .then(async resp => {
      await bcrypt.compare(password, resp.password_digest, function (err, result) {
        console.log(result)
        if (!result) {
          console.log("success!")
          return res.send({status: 200, user_id: resp.user_id})
        }
        console.log("password is incorrect")
      })
    }).catch(err => {
      console.log(err);
    })

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
