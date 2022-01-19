const express = require('express');
const app = express.Router();
/* NOTE THAT THE TOKEN STRING MUST BE GENERATED BASED ON AN EXISTING USER IN YOUR DB
curl -X GET http://localhost:3001/api/dashboard -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ1c2VyX2VtYWlsIjoiZWF0ZGVtQGNvb2tpZXMuY29tIiwiaWF0IjoxNjQyNTI5NTAyfQ.I4wkKqnv9fuPCxHob8dIwOrrlzF-F_FLvT2r5bTtROs" -H "Content-Type: application/json"
*/
//Default route is /api/dashboard
module.exports = () => {
  app.get('/', (req, res) => {
    const user = req.body.user; // { id, email }
    // TODO: Some function to get the dashboard data for a user.
    const dashboardData = {};
    return res.status(200).send({success: true, user, dashboardData});
  });
  return app;
}
const getPortfolioData = (options, db) => {
  const queryParams = [options.user_id];
  let queryString = `
      SELECT * FROM portfolios
      WHERE user_id = $1
    `;
  return db.query(queryString, queryParams)
    .then(response => {
      return response.rows;
    })
    .catch(err => {
      console.log(`ERROR in getPortfoliosByUser user_id: ${options.user_id}`);
      console.log(err.message)
      return err;
    });
};
