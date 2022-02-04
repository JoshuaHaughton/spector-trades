import axios from "axios";

export default async (req, res) => {
  if (!req.body['id']) {
     return res.status(400).json({error: 'No ids given'});
  }
  if (!Array.isArray(req.body.id)) {
    return res.status(400).json({error: 'Not an array of ids'});
 }

 var options = {
  method: 'GET',
  url: 'https://twelve-data1.p.rapidapi.com/quote',
  params: {interval: '1day', symbol: req.body.id.join(', '), format: 'json', outputsize: '30'},
  headers: {
    'x-rapidapi-host': process.env.TWELVE_XRAPID_HOST,
    'x-rapidapi-key': process.env.TWELVE_XRAPID_KEY
  }
};

  const plusMinus = {};
  const response = await axios.request(options).then();

  if (req.body.id.length < 2) {
    plusMinus[response.data.symbol] = response.data.percent_change;
    return res.status(200).json( plusMinus );
  }
  
  for (const symbol in response.data) {
    plusMinus[symbol] = response.data[symbol].percent_change;
  }
  
  res.status(200).json( plusMinus )
}
