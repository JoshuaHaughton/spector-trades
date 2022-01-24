import axios from "axios";

export default async (req, res) => {
  if (!req.body['symbol']) {
     return res.status(400).json({error: 'No symbol given'});
  }

  var options = {
    method: 'GET',
    url: process.env.TWELVE_HISTORY_URL,
    params: {symbol: req.body.symbol, interval: '1day', outputsize: '90', format: 'json'},
    headers: {
      'x-rapidapi-host': process.env.TWELVE_XRAPID_HOST,
      'x-rapidapi-key': process.env.TWELVE_XRAPID_KEY
    }
  };

  axios.request(options).then(response => {
    res.status(200).json(response.data)
  }).catch(err => {
    console.log(err.message);
    res.status(500).send({error: 'Error when requesting to twelve'});
  })
}