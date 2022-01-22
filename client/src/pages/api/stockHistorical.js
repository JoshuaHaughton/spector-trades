import axios from "axios";
const fs = require("fs");


export default async (req, res) => {
  if (!req.body['id']) {
    return res.status(400).json({error: 'No coin id given'});
  }
  const id = req.body['id'];

  fs.readFile('src/pages/api/stockHistorical.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log("READFILE ERR in stockHistorical: ", err)
      return res.status(200).send(err);
      // return res.status(500).send(err);
    } else {
    let stockHistory = JSON.parse(data); //now it an object

    const [storedData, remainingSearchKeys] = findStocks(id, stockHistory);
    console.log("keys left to search for: ", remainingSearchKeys)
    const options = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/time_series',
      params: {symbol: remainingSearchKeys.join(','), interval: '1day', outputsize: '365', format: 'json'},
      headers: {
        'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
        'x-rapidapi-key': '4da8bbba96mshde71119bcd05e66p152d89jsn9db02680c1dd'
      }
    };
    if (remainingSearchKeys.length !== 0) {
    console.log("MAKING REQUEST TO twelve-data-api for: ", remainingSearchKeys)
      axios.request(options).then(function (response) {
        const respKeys = Object.keys(response.data);
        respKeys.forEach(key => {
            stockHistory[key] = response.data[key];
        });
        const json = JSON.stringify(stockHistory);
        fs.writeFile('src/pages/api/stockHistorical.json', json, 'utf8', function readFileCallback(err, data) {
          if (err) {
            console.log("error writing back to json, cryptoHistorical", err)
            // console.log(json);
          }
          remainingSearchKeys.forEach(key => {
            stockHistory[key] = response.data[key];
          });
          return res.status(200).json(stockHistory);
        });

      }).catch(function (error) {
        console.error(error);
      });
    } else {
      console.log("NO SEARCH REQUIRED IN STOCKSHISTORICAL")
      // console.log("storedData sent: ", storedData)
      return res.status(200).json(storedData);
    }

  }
  });
  function findStocks(stocksArray, data) {
    const searchArray = JSON.parse(JSON.stringify(stocksArray));
    const output = {};
    const keys = Object.keys(data);

    stocksArray.forEach((key, i) => {

      if (keys.includes(key)) {
        console.log("MATCH")
        output[key] = data[key];
        if (i === 1) {
          searchArray.pop();
        } else {
          searchArray.splice(i, 1);
        }
      }

    });
    return [output, searchArray];
  }
}

