const express = require('express');
const app = express.Router();

module.exports = (db) => {

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

