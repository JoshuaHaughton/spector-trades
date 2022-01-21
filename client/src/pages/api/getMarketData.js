import axios from "axios";

// export default (req, res) => {
// return process.env.SECRET
// }


export default async (req, res) => {
  const URL = `http://localhost:3001/api/users/${process.env.SECRET}`;
  const response = await axios.get(URL);
  res.status(200).json({ data: response.data })
}
