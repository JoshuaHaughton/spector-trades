const axios = require("axios");
import api from "../../apis/api";

// Formats incoming news api response to have no duplicates and to
// only include articles posted in the past 24 hours in order of most recent
const cleanFetchQuery = (articles) => {
  //There were duplicate articles from multiple news sources, this fixed that
  const noDuplicateArticles = articles.filter((thing, index, self) => {
    return self.findIndex((t) => t.title === thing.title) === index;
  });

  const today = new Date();

  //Fixes bug where posts from the future were showing (e.g. "in 5 hours")
  const filteredArticles = noDuplicateArticles.filter(
    (article) => Date.parse(article.publishedAt) < Date.parse(today)
  );

  return filteredArticles;
};

//Sorts incoming post or article arrays and sets it to state
const organizeForState = (arr, symbol, setNewsFeed) => {
  //shows array in order of most recent
  const sortedArray = arr.sort((a, b) => {
    let a_date;
    let b_date;

    if (a.publishedAt) a_date = Date.parse(a.publishedAt);
    if (a.created_at) a_date = Date.parse(a.created_at);

    if (b.publishedAt) b_date = Date.parse(b.publishedAt);
    if (b.created_at) b_date = Date.parse(b.created_at);

    return b_date - a_date;
  });

  setNewsFeed((prev) => {
    const newNewsFeed = prev;

    newNewsFeed[symbol] = sortedArray;

    return newNewsFeed;
  });
};

//Retrieves all posts
const fetchPosts = async (setNewsFeed) => {
  const posts = await api.get(`/posts`);

  organizeForState(posts.data.data.posts, "posts", setNewsFeed);
};


const cleanResponses = async function (newsParams, setNewsFeed, cookies) {
  for (let i = 0; i < newsParams.length; i++) {
    let options = {
      method: "GET",
      url: `https://newsapi.org/v2/everything?q=${newsParams[i].name}&apiKey=bfb58d5c22df4f449db6799742aa03b0`,
    };

    let res;
    res = await axios.request(options)
    .catch(async err => {
      // if api limit reached, use another api key
      if (err)

      options = {
        method: "GET",
        url: `https://newsapi.org/v2/everything?q=${newsParams[i].name}&apiKey=159e795495ec48febee3724f82d82ceb`,
      }

      res = await axios.request(options)

    });

    const cleaned = cleanFetchQuery(res.data.articles);

    for (let article of cleaned) {
      let formattedObject = {
        mediaTitle:
          article.title.length > 55 ? article.title.substring(0, 55) + "..." : article.title,
        mediaPublish: article.publishedAt,
        mediaBody:
          article.description.length > 150
            ? article.description.substring(0, 150) + "..."
            : article.description,
        id: article.title
          .split(" ")
          .join("")
          .split("%")
          .join("")
          .split(`’`)
          .join("")
          .split(`'`)
          .join("")
          .split(",")
          .join("")
          .split(".")
          .join(""),
        media: article,
        type: `original_article_title`,
      };

      try {
        createArticle(formattedObject, cookies);
      } catch (err) {
        console.log(err);
      }
    }

    console.log("this is the symbol:", newsParams[i].symbol);
    organizeForState(cleaned, newsParams[i].symbol, setNewsFeed);
  }
};

const createArticle = async (state, cookies) => {
  let id = state.id
    .split(" ")
    .join("")
    .split("%")
    .join("")
    .split(`’`)
    .join("")
    .split(`'`)
    .join("")
    .split(",")
    .join("")
    .split(".")
    .join("");

  try {
    //Retrieve article
    let media = await api({
      method: "get",
      url: `/media/${state.type}/${id}`,
      data: state,
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies.spector_jwt,
      },
    });

    //If it exists
    if (Object.keys(media.data.data).length > 0) {
      //save retrieved article
      const savedArticle = media.data.data.article;
    } else {


      //create article
      await api({
        method: "post",
        url: "/articles",
        data: state,
        headers: {
          "Content-Type": "application/json",
          Authorization: cookies.spector_jwt,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchFeedData = async (setSymbols, setNewsFeed, cookies) => {
  let newsParams = [];

  //Get posts from all users
  await fetchPosts(setNewsFeed);

  try {
    //get user id
    let getUser = await api({
      method: "get",
      url: `/users/id/me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`,
      },
    });

    let user_id = getUser.data.data.user;

    //get a list of all user assets
    let getAssets = await api({
      method: "get",
      url: `/orders/me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`,
      },
    });

    let user_assets = getAssets.data.data.assetOrders;

    //Sets asset symbols (eg. BTC) to keys in an object
    let asset_symbols = {};
    user_assets.forEach((a) => {
      if (!asset_symbols[a.symbol]) {
        asset_symbols[a.symbol] = {};
      }
      asset_symbols[a.symbol] = { name: a.name, symbol: a.symbol };
    });

    //Render the tabs
    setSymbols(["posts", ...Object.keys(asset_symbols)]);

    //Create a list of paramters to use for the search using the names of all user assets
    for (let asset of Object.values(asset_symbols)) {
      newsParams.push(asset);
    }

    await cleanResponses(newsParams, setNewsFeed, cookies);
    return;
  } catch (error) {
    //fail
    console.error(error);
  }
};

module.exports = { fetchFeedData };
