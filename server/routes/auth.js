const express = require('express');
const app = express.Router();

//Default route is /api/auth
module.exports = () => {
  app.get('/', (req, res) => {
    const user = req.body.user; // { id, email }
    return res.status(200).send({success: true, user})
  });
  return app;
}