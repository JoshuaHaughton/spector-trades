import axios from "axios";

export default async (req, res) => {
  if (!req.body['id']) {
     return res.status(400).json({error: 'No coin id given'});
  }
  const URL = `https://api.coingecko.com/api/v3/coins/${req.body.id}/market_chart?vs_currency=cad&days=90&interval=daily`;
  const response = await axios.get(URL);
  res.status(200).json( response.data )
}