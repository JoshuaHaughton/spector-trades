const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  if (!req.body.jwt_token) {
    return res.send({status: 403, message: "missing jwt token"});
  }
  const token = req.body.jwt_token;
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        console.log(err);
        return res.send({status: 403, message: "invalid token"});
    }
    console.log("authorized user: ", user);
    req.body.user = {id: user.user_id, email: user.user_email}
    next();
  });
};

module.exports = { authenticateToken };