const express = require('express');
const app = express.Router();

const {
  getPortfoliosByUser,
  addPortfolio,
  verifyUniquePortfolioName
} = require('./helpers/portfolio-helpers');

const { authenticateToken } = require('../middleware/authenticateToken');
//Default route is /api/porfolios

/* NOTE THAT THE TOKEN STRING MUST BE GENERATED BASED ON AN EXISTING USER IN YOUR DB
curl -X POST http://localhost:3001/api/portfolios -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ1c2VyX2VtYWlsIjoiZWF0ZGVtQGNvb2tpZXMuY29tIiwiaWF0IjoxNjQyNTI5NTAyfQ.I4wkKqnv9fuPCxHob8dIwOrrlzF-F_FLvT2r5bTtROs" -H "Content-Type: application/json" --data-binary @- <<DATA
{"name":"COOKIEMONSTERSFALLPICKS",
"live":true}
DATA
*/

module.exports = (db) => {

  app.post('/', authenticateToken, (req, res) => {
    if (!req.body.user|| !req.body.name ||
      req.body.live === undefined) {
      console.log("FAILED POST TO PORTFOLIOS, req.body: ", req.body);
      return res.sendStatus(422);
    }
    const { user, name, live } = req.body;
    const spec_money = req.body.spec_money ? req.body.spec_money : null;

    verifyUniquePortfolioName({
      name,
      user_id: user.id,
      live
    }, db)
      .then(result => {
        console.log(result)
        if (!result) {
          return res.send({status: 500, error: "Portfolio name already in use"});
        }

        addPortfolio({
          user_id: user.id,
          live,
          spec_money,
          name
        }, db)
          .then(result => {
            console.log("addPortfolio result: ", result);
            res.send({status: 200, result})
          })
          .catch(err => {
            console.log("ERROR in addPortfolio: ", err);
            res.send({status: 500, error: err})
          });
      })
      .catch(err => {
        console.log(err)
      });

  });

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
    // console.log(res)
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
