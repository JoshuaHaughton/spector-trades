import axios from "axios";
const fs = require("fs");
const moment = require('moment');
function readFile (srcPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(srcPath, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function writeFile (savPath, data, ) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(savPath, data, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export default async (req, res) => {
  if (!req.body['id']) {
    return res.status(400).json({error: 'No coin id given'});
  }
  const id = req.body['id'];

  let needsSearch;
  let stockHistory;
  let storedData;
  readFile('src/pages/api/stockHistorical.json').then((data) => {
    stockHistory = JSON.parse(data); //now it an object
    storedData = findStocks(id, stockHistory)[0];
    needsSearch = findStocks(id, stockHistory)[1];
    console.log("keys left to search for: ", needsSearch);

    const options = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/time_series',
      params: {symbol: id.join(','), interval: '1day', outputsize: '365', format: 'json'},
      headers: {
        'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
        'x-rapidapi-key': '4da8bbba96mshde71119bcd05e66p152d89jsn9db02680c1dd'
      }
    };

    if (needsSearch.includes(true)) {
      console.log("MAKING REQUEST TO twelve-data-api for: ", needsSearch);
      return axios.request(options);
    }

    // return storedData if no remaining keys
    return new Promise((resolve, reject) => {
      resolve({storedData});
    });

  }).then(response => {
    if (response['storedData']) {
      console.log("NO SEARCH REQUIRED IN STOCKSHISTORICAL for: ", id)
      return res.status(200).json(response.storedData);
    }

    if (response) {
      // console.log(response.data)
      const respKeys = Object.keys(response.data);
      respKeys.forEach(key => {
        stockHistory[key] = response.data[key];
      });
      const json = JSON.stringify(stockHistory);

      id.forEach(key => {
        stockHistory[key] = response.data[key];
      });

      res.status(200).json(stockHistory);

      return writeFile('src/pages/api/stockHistorical.json', json);
    }
  }).catch(err => console.log("promise error happened!", err.message));

  function findStocks(stocksArray, data) {
    // const searchArray = JSON.parse(JSON.stringify(stocksArray));
    let needsSearch = [];
    const output = {};
    const keys = Object.keys(data);
    const now = new Date(new Date().setHours(-6, 0, 0, 0));
    if (moment(new Date()).format('dddd') === 'Saturday') {
      now.setDate(now.getDate() - 1);
    }
    if (moment(new Date()).format('dddd') === 'Sunday') {
      now.setDate(now.getDate() - 2);
    }
    let month = now.getMonth() + 1
    if (month < 10) {
      month = '0' + month;
    }
    const today = `${now.getFullYear()}-${month}-${now.getDate()}`
    stocksArray.forEach((key, i) => {
      if (keys.includes(key)) {
        const values = Object.values(data[key].values) || []
        values.forEach(day => {
          if (today === day.datetime) {
            needsSearch.push(false);
            output[key] = data[key];
          }

        })

      } else {
        needsSearch.push(true);
      }

    });
    return [output, needsSearch];
  }
}
