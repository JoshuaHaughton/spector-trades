const express = require('express');
const app = express.Router();
const { verifyReqParams, addAssetOrder } = require('./helpers/asset_orders-helper');

const { authenticateToken } = require('../middleware/authenticateToken');
/* 
curl -X POST http://localhost:3001/api/orders -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2VtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY0MjYyNDM1M30.zjsC1ZZxlIs-cu6pE-_lwohuHs6sXlS0ZlSjJmwzh6g" -H "Content-Type: application/json" --data-binary @- <<DATA
{
 "name": "MyFirstPortfolio",
 "live": true
 "asset_name": "Ethereum",
 "asset_symbol": "ETH",
 "type": "Cryptocurrency",
 "exit_point": 150000,
 "price_at_purchase": 1000,
 "units": 5,
 "sold": false
}
DATA
*/
//Default route is /api/orders


module.exports = (db) => {
// Add authToken when done testing
  app.post('/', authenticateToken, (req, res) => {
    console.log("INCOMING TO ASSET_ORDERS");
    console.log(req.body)
    if (!verifyReqParams(req)) {
        console.log("INCOMING IS MISSING A FIELD")
        return res.sendStatus(422);
      }

    const { type, user } = req.body;

    if (type === 'Cryptocurrency' || type === "Stocks") {

      addAssetOrder({
        ...req.body,
        asset: req.body.asset_name,
        symbol: req.body.asset_symbol,
        user_id: user.id
      }, db.promDB)
      .then(result => {
        console.log(result)
        return res.send(result.newAsset).status(200)
      })
      .catch(err => {
        console.log("ERROR in addAssetOrder: ", err)
        return res.sendStatus(500)
      })
    } else {
      console.log("Malformed type string");
      return res.send({error: 'type is not an accepted format'});
    }
  });

app.get('/', async (req, res) => {
  try {
    const assetOrders = await db.query(`
    SELECT * FROM asset_orders;
    `);

    res.status(200).json({
      status: "success",
      results: assetOrders.rows.length,
      data: {
        assetOrders: assetOrders.rows
      }
    })
    res.send(assetOrders.rows);

  } catch(err) {

    res.status(500).send;
    console.log(res)
  }
})
return app;

}

