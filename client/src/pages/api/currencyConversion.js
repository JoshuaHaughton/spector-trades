import axios from "axios";

export default async (req, res) => {
  const options = {
    method: 'GET',
    url: `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_KEY}/latest/USD`,
    // headers: {
    //   'x-rapidapi-host': process.env.EXCHANGE_RATE_HOST,
    //   'x-rapidapi-key': process.env.EXCHANGE_RATE_KEY
    // }
  };
  console.log("Sending request for currency conversions...")
  axios.request(options).then(function (response) {
    const conversions = response.data.conversion_rates;
    return res.status(200).send(conversions);

  }).catch(function (error) {
    console.error("ERROR in currencyConversions: ", error);
    return res.status(200).send(error);
  });

};
