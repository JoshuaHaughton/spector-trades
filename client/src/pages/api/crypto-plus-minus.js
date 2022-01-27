import axios from "axios";




export default async (req, res) => {
  if (!req.body['id']) {
     return res.status(400).json({error: 'No coin ids given'});
  }

  const plusMinus = {};
  const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

  const options = {
    method: 'GET',
    url: `https://coingecko.p.rapidapi.com/coins/${req.body.id}`,
    params: {
      sparkline: 'false',
      developer_data: 'false',
      community_data: 'false',
      market_data: 'true',
      tickers: 'false',
      localization: 'false'
    },
    headers: {
      'x-rapidapi-host': process.env.COIN_GECKO_HOST,
      'x-rapidapi-key': process.env.INDIVIDUAL_ASSET_COIN_GECKO_SECRET
    }
  };
  await delay();
  axios.request(options).then(async response => {
    
    return res.status(200).json({plusMinus: response.data.market_data.price_change_percentage_24h })

  }).catch( err => {
    console.log(err);
    return res.status(500).json(err);
  });
    
}