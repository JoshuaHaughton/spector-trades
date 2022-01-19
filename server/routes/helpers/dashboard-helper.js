const getPortfolioDataByUser = (options, db) => {

  return db.task(t => {
    return t.any('SELECT * FROM portfolios WHERE user_id = $1', options.user_id)
        .then(portfolios => {
                if (portfolios.length === 0) {
                  return false;
                }
                const portfolioIds = [];

                portfolios.forEach((portfolio) => {
                  portfolioIds.push(portfolio.id);
                });

                let queryString = `
                  SELECT * FROM asset_orders
                  WHERE portfolio_id = $1
                `;

                portfolioIds.forEach((id, index) => {
                  if (index !== 0) {
                    queryString += `OR portfolio_id = $${index + 1}`
                  }
                });
                queryString += `;`
                return t.any(queryString, portfolioIds)
                    .then(assetOrders => {
                        return {portfolios, assetOrders};
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

const parsePortfolioDataByUser = (data) => {
  const portfolioData = {};
  if (!data.portfolios) {
    return portfolioData;
  }
  data.portfolios.forEach(portfolio => {
    const assets = [];
    let total_assets_value = 0;
    let total_crypto_assets = 0;
    let total_stock_assets = 0;
    let spec_money_left;
    if (!portfolio.live) {
      spec_money_left = portfolio.spec_money;
    }
    data.assetOrders.forEach(order => {
      if (order.portfolio_id == portfolio.id) {
        assets.push(order)
        total_assets_value += (
          order.sold ? - order.price_at_purchase : order.price_at_purchase
        );
        if (order.type === "Cryptocurrency") {
          if (!order.sold) {
            total_crypto_assets += order.price_at_purchase;
          }
          if (order.sold) {
            total_crypto_assets -= order.price_at_purchase;
          }
        }
        if (order.type === "Stocks") {
          if (!order.sold) {
            total_stock_assets += order.price_at_purchase;
          }
          if (order.sold) {
            total_stock_assets -= order.price_at_purchase;
          }
        }
        if (spec_money_left) {
          if (!order.sold) {
            spec_money_left -= order.price_at_purchase;
          }
          if (order.sold) {
            spec_money_left += order.price_at_purchase;
          }
        }
      }
    });

    portfolioData[portfolio.id] = {
      portfolioInfo: portfolio,
      assets,
      total_assets_value: total_assets_value,
      total_crypto_assets,
      total_stock_assets,
      "spec_money_left": spec_money_left ? spec_money_left : null
    };

  })
  return portfolioData;
};
module.exports = {getPortfolioDataByUser, parsePortfolioDataByUser};
