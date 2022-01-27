import axios from "axios";

export default async (req, res) => {
  if (!req.body['id']) {
     return res.status(400).json({error: 'No coin id given'});
  }

  const options = {
    method: 'GET',
    url: 'https://coingecko.p.rapidapi.com/simple/price',
    params: {vs_currencies: 'cad', ids: req.body.id},
    headers: {
      'x-rapidapi-host': process.env.COIN_GECKO_HOST,
      'x-rapidapi-key': process.env.INDIVIDUAL_ASSET_COIN_GECKO_SECRET
    }
  };


  axios.request(options).then(response => {
    return res.status(200).json( response.data );
  }).catch(err => {
    console.log(err);
    return res.status(500).send(err.message);
  });

  
}