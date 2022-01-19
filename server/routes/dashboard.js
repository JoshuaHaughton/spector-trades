const express = require('express');
const app = express.Router();
const { 
  parsePortfolioDataByUser,
  getPortfolioDataByUser 
} = require('./helpers/dashboard-helper');
// const { getPortfoliosByUser } = require('./helpers/portfolio-helpers');
/* NOTE THAT THE TOKEN STRING MUST BE GENERATED BASED ON AN EXISTING USER IN YOUR DB
curl -X GET http://localhost:3001/api/dashboard -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ1c2VyX2VtYWlsIjoiZWF0ZGVtQGNvb2tpZXMuY29tIiwiaWF0IjoxNjQyNTI5NTAyfQ.I4wkKqnv9fuPCxHob8dIwOrrlzF-F_FLvT2r5bTtROs" -H "Content-Type: application/json"
*/
//Default route is /api/dashboard
module.exports = (db) => {
  app.get('/', (req, res) => {
    console.log("GETTING REQUEST")
    const user = req.body.user; // { id, email }
    getPortfolioDataByUser({user_id: user.id}, db.promDB).then(result => {
      const portfolioData = parsePortfolioDataByUser(result);
      res.send(portfolioData);
    })
    .catch(err => {
      console.log("ERROR in getPortfolioDataByUser: ", err);
      return res.sendStatus(500);
    })
  });
  return app;
};
