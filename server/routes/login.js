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

// let express = require("express");
// let app = express.Router();

// module.exports = (db) => {
//   app.post("/", async (req, res) => {
    
//     const [email, password] = [req.body.email, req.body.password];
//     console.log("req body", req.body)


//     try {
//       const users = await db.query(`
//           SELECT * FROM users;
//           `);

//       res.status(200).json({
//         status: "success",
//         results: users.rows.length,
//         data: {
//           users: users.rows,
//         },
//       });
//       res.send(users.rows);
//     } catch (err) {
//       res.status(500).send;
//       console.log(err.message);
//     }
//   });
//   return app;
// };














/*
    bcrypt.compare("iniSaya", hash, function(err, res) {
        // res === true jika password inputan benar dan sama seperti di database, jika salah akan false, tinggal di berikan logika deh. 
        });
        //hash di ambil dari database, ini saya dari inputan form, (req.body.password)

    var salt = bcrypt.genSaltSync(10);
    // hash password dengan salt 
    var hash = bcrypt.compare("my password", salt);

    const checkEmail = function(email, db) {
        return db.query(
          `
          SELECT * FROM users
          WHERE email = $1
          RETURNING *;
          `, [ email ])
          .then(response => {
          return response.rows[0];
        }).catch(err => {
          console.log("ERROR in checkEmail", err.message);
        });
      }

      bcrypt.compare(password, hash, function(err, result) {
        // returns result
      }); 

      */

//   const users = await db.query(`
//   SELECT * FROM users;
//   `);
//   res.status(200).json({
//     status: "success",
//     results: users.rows.length,
//     data: {
//       users: users.rows
//     }
//   })
//   res.send(users.rows);
