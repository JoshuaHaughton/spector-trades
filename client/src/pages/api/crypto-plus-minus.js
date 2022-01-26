import axios from "axios";

export default async (req, res) => {
  if (!req.body['id']) {
     return res.status(400).json({error: 'No coin ids given'});
  }
  if (!Array.isArray(req.body.id)) {
    return res.status(400).json({error: 'Not an array of ids'});
 }

  const plusMinus = {};
  const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));
  for (const coin of req.body.id) {
    const URL = `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const response = await axios.get(URL);
      console.log('the response: ', response);
      plusMinus[response.data.id] = response.data.market_data.price_change_percentage_24h;
      await delay();
  }
  
  res.status(200).json( plusMinus )
}