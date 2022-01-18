const express = require('express');
const app = express.Router();

//Default route is /api/dashboard
module.exports = () => {
  app.post('/', (req, res) => {
    const user = req.body.user; // { id, email }
    // TODO: Some function to get the dashboard data for a user.
    const dashboardData = {};
    return res.status(200).send({success: true, user, dashboardData});
  });
  return app;
}