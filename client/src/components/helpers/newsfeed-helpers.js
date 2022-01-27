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
    (article) => Date.parse(article.published_date) < Date.parse(today)
  );

  return filteredArticles;
};



//Sorts incoming post or article arrays and sets it to state
const organizeForState = (arr, symbol, setNewsFeed) => {
  //shows array in order of most recent
  const sortedArray = arr.sort((a, b) => {
    let a_date;
    let b_date;

    if (a.published_date) a_date = Date.parse(a.published_date);
    if (a.created_at) a_date = Date.parse(a.created_at);

    if (b.published_date) b_date = Date.parse(b.published_date);
    if (b.created_at) b_date = Date.parse(b.created_at);

    return b_date - a_date;
  });

  console.log("ORGANIZED COMPLETE", sortedArray);
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


// api won't allow anything faster right now (free)..
// In order to maximize User Experience, Posts tabs is showed first,
// while other symbol tabs are fetching api and seting state
const cleanResponses = async function (newsParams, setNewsFeed) {
  const delay = (ms = 1250) => new Promise((r) => setTimeout(r, ms));

  for (let i = 0; i < newsParams.length; i++) {
    const options = {
      method: "GET",
      url: "https://free-news.p.rapidapi.com/v1/search",
      params: { q: newsParams[i].name, lang: "en" },
      headers: {
        "x-rapidapi-host": "free-news.p.rapidapi.com",
        "x-rapidapi-key": "f539cc1d29msh63171028d7f006ep13a356jsn42c6f4e0afe0",
      },
    };
    await delay();
    const res = await axios.request(options);

    const cleaned = cleanFetchQuery(res.data.articles);

    console.log("this is the symbol:", newsParams[i].symbol);
    organizeForState(cleaned, newsParams[i].symbol, setNewsFeed);
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
    console.log("user id FOR NEW CALLS", user_id);

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

    console.log("ASSETS FOR NEW API CALLS", Object.keys(asset_symbols), asset_symbols, user_assets);

    //Render the tabs
    setSymbols(["posts", ...Object.keys(asset_symbols)]);

    //Create a list of paramters to use for the search using the names of all user assets
    for (let asset of Object.values(asset_symbols)) {
      newsParams.push(asset);
    }
    console.log("QUERY LIST", newsParams);

    await cleanResponses(newsParams, setNewsFeed);
    return;
  } catch (error) {
    //fail
    console.error(error);
  }
};



module.exports = { fetchFeedData };
