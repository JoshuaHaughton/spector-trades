const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  //for some reason i needed the first element in the array for the comment post, so I created the below conditional as a fallback
  if (!token) {
    token = (authHeader && authHeader.split(' ')[0]);
  }

  if (!token) {
    console.log("missing jwt token")
    return res.status(403).send({status: 403, message: "missing jwt token"});
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        console.log(err);
        return res.status(403).send({status: 403, message: "invalid token"});
    }
    // console.log("authorized user: ", user);
    req.body.user = {id: user.user_id, email: user.user_email, avatar_url: user.user_avatar_url, name: user.user_name};
    next();
  });
};

module.exports = { authenticateToken };