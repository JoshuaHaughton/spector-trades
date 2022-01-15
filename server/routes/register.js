// REGISTRATION ROUTE (POST)
// ON SUCCESS SENDS
// {status: 200, user_id: x}
// user_id is the id of the new entry
// ON FAILURE sends 422 (Unprocessable Entity) see below
// https://stackoverflow.com/questions/3050518/what-http-status-response-code-should-i-use-if-the-request-is-missing-a-required
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 8; // SaltRounds should be over 10 in production
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
    let avatar_url;
    if (req.file) {
      avatar_url = req.file.filename;
    }


    bcrypt.hash(password, saltRounds, function (err, password_digest) {
      if (err) {
        console.log("bcrypt hash err: ", err)
      }
      const user = {
        username,
        email,
        password_digest
      } 
      if (avatar_url) {
        user["avatar_url"] = avatar_url;
      } else {
        user["avatar_url"] = null;
      }
      addUser(user, db).then(resp => {
        const responseString = { status: 200, user_id: resp.id };
        if (avatar_url) console.log('user avatar inserted in db');
        console.log("New user added");
        console.log(responseString)
        return res.send(responseString);
      }).catch(err => {
        // NOTE
        // Are we going to verify serverside or clientside if an email has been duplicated
        // in Users
        console.log('ERROR in db insert for user registration', err.message);
      });
    })

  });


return app;
}

const addUser = function(user, db) {
  let queryString = 
                    `
                    INSERT INTO 
                    users (username, email, password_digest, avatar_url)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                    `;

  const queryParams = [ user.username, user.email, user.password_digest, user.avatar_url ];

  return db.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};
