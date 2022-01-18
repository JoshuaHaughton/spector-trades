require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const morgan = require('morgan');
const app = express();
// const router = express.Router();
const db = require('./db')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"))

app.get('/', function (req, res) {
  res.send('Welcome To Home Page')
})


const userRoutes = require("./routes/users")
app.use("/api/users", userRoutes(db));

const portfolioRoutes = require("./routes/portfolios")
app.use("/api/portfolios", portfolioRoutes(db));

const assetOrderRoutes = require("./routes/asset_orders")
app.use("/api/orders", assetOrderRoutes(db));

const postRoutes = require("./routes/posts")
app.use("/api/posts", postRoutes(db));

const commentRoutes = require("./routes/comments")
app.use("/api/comments", commentRoutes(db));

const avatarRoutes = require("./routes/avatar_upload")
app.use("/api/avatars", avatarRoutes(db));

const RegisterRoutes = require("./routes/register")
app.use("/api/register", RegisterRoutes(db));

const loginRoutes = require("./routes/login")
app.use("/api/login", loginRoutes(db));

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes(db));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
