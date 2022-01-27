import axios from "axios";
import fs from 'fs';
export default async (req, res) => {
  const options = {
    method: 'GET',
    url: `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_KEY}/latest/USD`,
    // headers: {
    //   'x-rapidapi-host': process.env.EXCHANGE_RATE_HOST,
    //   'x-rapidapi-key': process.env.EXCHANGE_RATE_KEY
    // }
  };
  fs.readFile('src/pages/api/currencyConversion.json', 'utf8', function readFileCallback(err, data) {
    if (!err) {
      console.log("NOT SENDING request for currency conversions...")
      return res.status(200).send(data);
    } else {
      console.log("Sending request for currency conversions...")
      axios.request(options).then(function (response) {
        const conversions = response.data.conversion_rates;
        const json = JSON.stringify(response.data.conversion_rates);
        fs.writeFile('src/pages/api/currencyConversion.json', json, 'utf8', function writeFileCallback(err, data) {
          if (err) {
            console.log("ERROR writing conversions chart to file: ", err)
          }
        });
        return res.status(200).send(conversions);

      }).catch(function (error) {
        console.error("ERROR in currencyConversions: ", error);
        return res.status(200).send(error);
      });

    }
  });

};
