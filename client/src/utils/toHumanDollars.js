function centsToDollars(cents) {
  return Intl.NumberFormat().format(Number(cents)/100)
};

function niceMoney(dollars) {
  return Intl.NumberFormat().format(Number(dollars).toFixed(2))
}

module.exports = {centsToDollars, niceMoney}
