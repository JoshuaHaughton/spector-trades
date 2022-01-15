// REGISTRATION ROUTE (POST)
// ON SUCCESS SENDS
// {status: 200, user_id: x}
// user_id is the id of the new entry
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
    const { username, email, password } = req.body;
    const avatar_url = req.file.filename;

    bcrypt.hash(password, saltRounds, function (err, password_digest) {
      if (err) {
        console.log("bcrypt hash err: ", err)
      }
      addUser({
        username,
        email,
        password_digest,
        avatar_url
      }, db).then(resp => {
        const responseString = { status: 200, user_id: resp.id };
        if (avatar_url) console.log('user avatar inserted in db');
        console.log("New user added");
        console.log(responseString)
        return res.send(responseString);
      }).catch(err => {
        // NOTE
        // Are we going to verify serverside or clientside if an email has been duplicated
        // in Users
        console.log(`ERROR in db insert for user registration ${err.message}`);
      });
    })


    if (!req.file) {
      console.log("ERROR - Failed File Upload");
      console.log(req.body);
      return res.sendStatus(422)
      // 422 request payload is valid but
      // it cannot be processed due to invalid data
  
    }
  });


return app;
}

const addUser = function(user, db) {
  let queryString = 
                    `
                    INSERT INTO 
                    users (username, email, password_digest,
                    `;

  const queryParams = [ user.username, user.email, user.password_digest ];

  if (user.avatar_url) {
    queryString += ` avatar_url`;
    queryParams.push(user.avatar_url);
  }

  queryString += 
                  `
                  )
                  VALUES ($1, $2, $3
                  `;

  if (queryParams.length === 4) {
    queryString += `, $4`
  }

    queryString += 
    `
    )
    RETURNING *;
    `;

  return db.query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};
