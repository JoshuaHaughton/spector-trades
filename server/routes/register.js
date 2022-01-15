let express = require('express');
let app = express.Router();

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
// curl -X POST -F 'username=linuxize' -F 'email=linuxize@example.com' -F 'password=12345' -F 'avatar=@image.png' http://localhost:3001/api/register
module.exports = (db) => {
  app.post('/', upload.single('avatar'), (req, res) => {
    const { username, email, password } = req.body;
    const avatarName = req.file.filename;
    
    if (!req.file) {
      console.log("ERROR - Failed File Upload");
      console.log(req.body);
      return res.sendStatus(422)
      // 422 request payload is valid but
      // it cannot be processed due to invalid data
  
    }
      console.log('file received');
      console.log(`username: ${username} email: ${email} password: ${password}`)
      console.log()
      return res.sendStatus(200)
  });


return app;
}

