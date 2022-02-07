import axios from "axios";
const fs = require("fs");

export default async (req, res) => {
  if (!req.body['id']) {
    return res.status(400).json({error: 'No coin id given'});
  }
  const id = req.body['id'].toLowerCase();
  const options = {
    method: 'GET',
    url: `https://coingecko.p.rapidapi.com/coins/${id}/market_chart?vs_currency=cad&days=max`,
    params: {vs_currency: 'cad', days: 'max'},
    headers: {
      'x-rapidapi-host': process.env.COIN_GECKO_HOST,
      'x-rapidapi-key': process.env.COIN_GECKO_SECRET
    }
  };

  fs.readFile('src/pages/api/cryptoHistorical.json', 'utf8', function readFileCallback(err, data){
    if (err){
      return res.status(200).send(err);
    }
    let cryptoHistory = JSON.parse(data);
    let historicalData = Object.keys(cryptoHistory);
    if (historicalData.includes(id) && isCurrent(cryptoHistory, id) && cryptoHistory[id].length !== 0) {
      console.log(`FOUND DATA IN API FOR ${id}`)
      return res.status(200).json(cryptoHistory[id]);
    }
    // console.log(options)
    console.log("MAKING REQUEST TO COINGECKO for: ", id)
    axios.request(options).then(function (response) {
      if (!response.data) {
        return res.status(500).send(error);
      }
      cryptoHistory[id] = response.data.prices
      const json = JSON.stringify(cryptoHistory)
      fs.writeFile('src/pages/api/cryptoHistorical.json', json, 'utf8', function writeFileCallback(err, data) {
        if (err) {
          console.log("error writing back to json, cryptoHistorical", err)
        }
      });
      return res.status(200).json(response.data.prices);
    }).catch(function (error) {
      console.log("RESPONSE FROM COINGECKO:", error)

      return res.status(500).send(error);
    });
  });

}

function isCurrent(data, asset) {
  let current = false
  const now = new Date(new Date().setHours(0, 0, 0, 0));
  const cryptoValues = Object.values(data[asset]);
  // console.log(cryptoValues)
  cryptoValues.forEach(day => {
    const currentDay = new Date(new Date(day[0]).setHours(0, 0, 0, 0));
    // console.log(currentDay, now)
  if (currentDay.getTime() === now.getTime()) {
    current = true;
  }
  })
  return current;
}
