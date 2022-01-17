// REGISTRATION ROUTE (POST)
// ON SUCCESS SENDS
// {status: 200, user_id: x}
// user_id is the id of the new entry
// ON ERROR sends 422 (Unprocessable Entity) if missing fields (username, email, password are req'd)
// ON ERROR sends 500 (Internal server error) Internal process error)
// ON ERROR sends 409 (conflict server error) username or email is not unique

const express = require('express');
const app = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 8; // SaltRounds should be over 10 in production

const { verifyUniqueColumns, addUser } = require('./helpers/user-helpers');

// File upload dependencies
const multer = require("multer");
const storage = multer.diskStorage({
  destination: './public/avatars',
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage});

//Default route is /api/register
// form fields are username, email, password, avatar
// curl -X POST -F 'username=linuxize' -F 'email=linuxize@example.com' -F 'password=password' -F 'avatar=@image.png' http://localhost:3001/api/register
module.exports = (db) => {
  app.post('/', upload.single('avatar'), (req, res) => {
    console.log("Incoming to server...")
    console.log(req.body)
    
    if (!req.body.username || !req.body.email || !req.body.password ) {
      return res.sendStatus(422);
    }
    const { username, email, password } = req.body;
    const avatar_url = req.file ? req.file.filename : null;
    
    verifyUniqueColumns({email, username}, db)
    .then(result => {
      console.log(result)
      if (result.unique === false) {
        if (result.dup_username && result.dup_email) {
          console.log("DUPLICATE EMAIL AND USERNAME")
          return res.status(409).send({message: "username AND email already in use"})
        }

        if (result.dup_username) {
          console.log("DUPLICATE USERNAME")
          return res.status(409).send({message: "username already in use"})
        }

        if (result.dup_email) {
          console.log("DUPLICATE EMAIL")
          return res.status(409).send({message: "email already in use"})
        }
      }
      bcrypt
        .hash(password, saltRounds, function (err, password_digest) {
          if (err) {
            console.log("bcrypt hash err: ", err)
            return res.send({status: 500, message: "hashing error - bad password"})
          }
    
          const user = {
            username,
            email,
            password_digest,
            avatar_url
          };
    
          addUser(user, db).then(resp => {
            const responseString = { status: 200, user_id: resp.id };

            console.log("New user added");
            if (avatar_url) console.log('user avatar inserted in db');
            console.log("response sent to client: ", responseString)

            return res.send(responseString);
          }).catch(err => {
            console.log('ERROR in db insert for user registration', err.message);
            return res.send({status: 500, message: "Error in adding User to table"})
          });
        })
    })
    .catch(resp => {
    console.log("ERROR in verifyUniqueColumn: ", resp);
    return res.send({status: 500, message: "Error in verifying unique columns"})
    });

    

  });


return app;
};
