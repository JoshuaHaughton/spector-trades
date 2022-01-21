/**
 * 
 * @param {*} values EX {
 "name": "MyFirstPortfolio",
  "live": true,
 "asset": "ETH",
 "type": "Cryptocurrency",
 "exit_point": 150000,
 "price_at_purchase": 1000,
 "units": 5,
  "sold": false
  user_id: 1
}
 * @param {*} db POOL pg-promise connection (db.promDB)
 * @returns rows of newly entered asset_order
 */
const addAssetOrder = (values, db) => {
  const queryStringSelect = `
  SELECT * FROM portfolios
  WHERE user_id = $1
  AND
  name = $2
  AND
  live = $3;
  `;
  const queryParamsSelect = [
    values.user_id,
    values.name,
    values.live
  ];
  return db.task(t => {
    return t.one(queryStringSelect, queryParamsSelect)
        .then(portfolio => {
                const queryStringInsert = `
                INSERT INTO 
                asset_orders (
                  name,
                  type,
                  units,
                  price_at_purchase,
                  user_id,
                  portfolio_id,
                  sold,
                  exit_point
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
                `;
                const queryParamsInsert = [
                  values.asset,
                  values.type,
                  values.units,
                  values.price_at_purchase,
                  values.user_id,
                  portfolio.id,
                  values.sold,
                  values.exit_point
                ];
                return t.any(queryStringInsert, queryParamsInsert)
                    .then(newAsset => {
                        return {newAsset};
                    })
        });    
  })
    .then(data => {
        return data;
    })
    .catch(error => {
        return error;
    });
};

/**
 * 
 * @param {*} req request body
 * @returns true if all params are present
 */
const verifyReqParams = (req) => {
  if (
    !req.body.name ||
    req.body.live === undefined ||
    !req.body.asset ||
    !req.body.type ||
    req.body.exit_point === undefined ||
    !req.body.price_at_purchase ||
    !req.body.units ||
    req.body.sold === undefined
    )
  {
    return false;
  }
  return true;
};

module.exports = { verifyReqParams, addAssetOrder };
