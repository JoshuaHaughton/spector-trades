require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const morgan = require('morgan');
const app = express();
const { authenticateToken } = require('./middleware/authenticateToken');
// const router = express.Router();
const db = require('./db')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"))

app.get('/', function (req, res) {
  res.send('Welcome To Home Page')
})


// user routes import
const userRoutes = require("./routes/users")
app.use("/api/users", userRoutes(db));

// portfolio routes import
const portfolioRoutes = require("./routes/portfolios")
app.use("/api/portfolios", portfolioRoutes(db));

// asset order routes import
const assetOrderRoutes = require("./routes/asset_orders")
app.use("/api/orders", assetOrderRoutes(db));

// post routes import
const postRoutes = require("./routes/posts")
app.use("/api/posts", postRoutes(db));

// comment routes import
const commentRoutes = require("./routes/comments")
app.use("/api/comments", commentRoutes(db));

// avatar upload routes
const avatarRoutes = require("./routes/avatar_upload")
app.use("/api/avatars", avatarRoutes(db));

// register routes
const RegisterRoutes = require("./routes/register")
app.use("/api/register", RegisterRoutes(db));

// login routes
const loginRoutes = require("./routes/login")
app.use("/api/login", loginRoutes(db));

// article routes
const articleRoutes = require("./routes/articles")
app.use("/api/articles", articleRoutes(db));

// like routes
const likeRoutes = require("./routes/likes")
app.use("/api/likes", likeRoutes(db));

// Auth jwt testing
const authRoutes = require("./routes/auth")
app.use("/api/auth", authenticateToken, authRoutes());

// Dashboard routes import
// const dashboardRoutes = require("./routes/dashboard");
// app.use("/api/dashboard", authenticateToken, dashboardRoutes(db));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
