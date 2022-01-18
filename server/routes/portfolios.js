const express = require('express');
const app = express.Router();
const { getPortfoliosByUser } = require('./helpers/portfolio-helpers');
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

app.get('/user_id/:user_id', (req, res) => {
  const { user_id } = req.params;
  getPortfoliosByUser({
    user_id,
  }, db)
    .then(resp => {
      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          portfolios: resp
        }
      });
    })
});

app.get('/live/user_id/:user_id', (req, res) => {
  const { user_id } = req.params;
  getPortfoliosByUser({
    user_id,
    live: true
  }, db)
    .then(resp => {
      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          portfolios: resp
        }
      });
    })
});

app.get('/spec/user_id/:user_id', (req, res) => {
  const { user_id } = req.params;
  getPortfoliosByUser({
    user_id,
    live: false
  }, db)
    .then(resp => {
      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          portfolios: resp
        }
      });
    })
});

app.get('/user_id/:user_id/name/:portfolio_name', (req, res) => {
  const { user_id, portfolio_name } = req.params;
  getPortfoliosByUser({
    user_id,
    portfolio_name
  }, db)
    .then(resp => {
      res.status(200).json({
        status: "success",
        results: resp.length,
        data: {
          portfolios: resp
        }
      });
    })
});

return app;

}
