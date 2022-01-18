const express = require('express');
const app = express.Router();

//Default route is /api/porfolios

module.exports = (db) => {

app.get('/', async (req, res) => {
  try {
    const portfolios = await db.query(`
    SELECT * FROM portfolios;
    `);

    res.status(200).json({
      status: "success",
      results: portfolios.rows.length,
      data: {
        portfolios: portfolios.rows
      }
    })
    res.send(portfolios.rows);

  } catch(err) {

    res.status(500).send;
    console.log(res)
  }
})
return app;

}

