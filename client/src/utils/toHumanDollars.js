export default function centsToDollars(cents) {
  return Intl.NumberFormat().format(Number(cents)/100)
};
