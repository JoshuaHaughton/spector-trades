let express = require('express');
let app = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: './public/avatars',
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage});
//Default route is /api/avatars


module.exports = (db) => {
  app.get('/', async (req, res) => {
    try {
      const users = await db.query(`
      SELECT * FROM users;
      `);
      res.status(200).json({
        status: "success",
        results: users.rows.length,
        data: {
          users: users.rows
        }
      })
      res.send(users.rows);
  
    } catch(err) {
  
      res.status(500).send;
    }
  })

  app.post('/upload', upload.single('avatar'), (req, res) => {
    if (!req.file) {
      console.log("ERROR - Failed File Upload");
      console.log(req.body);
      return res.sendStatus(422)
      // 422 request payload is valid but
      // it cannot be processed due to invalid data
  
    }
      console.log('file received');
      console.log(req.body)
      return res.sendStatus(200)
  });
  
  
  return app;
  }
