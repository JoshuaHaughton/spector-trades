import axios from "axios";
const fs = require("fs");


export default async (req, res) => {
  if (!req.body['id']) {
    return res.status(400).json({error: 'No coin id given'});
  }
  const id = req.body['id'];

}

