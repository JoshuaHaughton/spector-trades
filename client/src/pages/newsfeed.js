import Head from "next/head";
import { useState, useEffect } from "react";
const axios = require("axios");
import { Box, Container, Grid, Pagination } from "@mui/material";
import { NewsfeedListToolbar } from "../components/newsfeed/newsfeed-list-toolbar";
import { NewsfeedCard } from "../components/newsfeed/newsfeed-card";
import { DashboardLayout } from "../components/dashboard-layout";
import api from "src/apis/api";
import { useCookies } from 'react-cookie';
import { RateLimiter } from "limiter";

const Newsfeed = () => {
  const [newsFeed, setNewsFeed] = useState([]);
  const [reloadFeed, setReloadFeed] = useState(false)
  const [cookies, setCookie] = useCookies();

  const triggerReload = () => {
    reloadFeed ? setReloadFeed(false) : setReloadFeed(true);
  }

  //region must be one of the following: US|BR|AU|CA|FR|DE|HK|IN|IT|ES|GB|SG
  // const options = {
  //   method: 'GET',
  //   url: 'https://free-news.p.rapidapi.com/v1/search',
  //   params: {q: 'Money', lang: 'en'},
  //   headers: {
  //     'x-rapidapi-host': 'free-news.p.rapidapi.com',
  //     'x-rapidapi-key': 'f539cc1d29msh63171028d7f006ep13a356jsn42c6f4e0afe0'
  //   }
  // };

  let newsParams = [];
  let allRelatedArticles = [];

  // Formats incoming news api response to have no duplicates and to
  // only include articles posted in the past 24 hours in order of most recent
  const fetchFeedData = async () => {


    try {

      //get user id
    let getUser = await api({
      method: "get",
      url: `/users/id/me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`,
      },
    })

    let user_id = getUser.data.data.user
    console.log("user id FOR NEW CALLS", user_id)

      //get a list of all user assets
      let getAssets = await api({
        method: "get",
        url: `/orders/me`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.spector_jwt}`,
        },
    })

    let user_assets = getAssets.data.data.assetOrders
    console.log("ASSETS FOR NEW API CALLS", user_assets)


    //Create a list of paramters to use for the seach using the names of all user assets
    for (let asset of user_assets) {
      newsParams.push(asset.name)
    }
    console.log('QUERY LIST', newsParams)



        //api won't allow anything faster right now (free)
        //Retrieves 25 articles for every query
        const delay = (ms = 1250) => new Promise((r) => setTimeout(r, ms));
        const getTodosSeries = async function () {
          let results = [];
          for (let i = 0; i < newsParams.length; i++) {
            const options = {
              method: 'GET',
              url: 'https://free-news.p.rapidapi.com/v1/search',
              params: {q: newsParams[i], lang: 'en'},
              headers: {
                'x-rapidapi-host': 'free-news.p.rapidapi.com',
                'x-rapidapi-key': 'f539cc1d29msh63171028d7f006ep13a356jsn42c6f4e0afe0'
              }
            };
            await delay();
            const res = await axios.request(options);

            results.push(res.data);
          }
          return results;
        };

        async function main() {
          // const strings = [1, 2, 3, 4];
          const results = await getTodosSeries();
          console.log('results',results);
          return results
        }

        let response = await main();

        console.log('yeaaaaa', response)

        //Push all articles into one big array of articles
        for (let obj of response) {

          allRelatedArticles = [...allRelatedArticles, ...obj.articles]
        }

        console.log('ALL QUERIES ', allRelatedArticles)


      //Retrieves all posts
      const posts = await api.get(`/posts`)
      console.log('POSTS', posts.data.data.posts)
      const postsArray = posts.data.data.posts;




         //There were duplicate articles from multiple news sources, this fixed that
         const noDuplicateArticles = allRelatedArticles.filter((thing, index, self) => {
          return self.findIndex(t => t.title === thing.title) === index
        });

        console.log("this the api", noDuplicateArticles)

        const today = new Date();

        //Fixes bug where posts from the future were showing (e.g. "in 5 hours")
        const filteredArticles = noDuplicateArticles.filter(article => Date.parse(article.published_date) < Date.parse(today))

        // adds posts to array
        const combinedArray = [...filteredArticles, ...postsArray];

        //returns articles published on the same day
        const sameDayCombined = combinedArray.filter(article => {

          let article_date

          if (article.published_date) article_date = Date.parse(article.published_date);
          if (article.created_at) article_date = Date.parse(article.created_at);

          return (article_date > (Date.parse(today) - 86400000))

        })

        console.log('same Day:', sameDayCombined)

        //shows array in order of most recent
        const sortedCombinedArray = sameDayCombined.sort((a, b) => {

          let a_date
          let b_date

          if (a.published_date) a_date = Date.parse(a.published_date)
          if (a.created_at) a_date = Date.parse(a.created_at)

          if (b.published_date) b_date = Date.parse(b.published_date)
          if (b.created_at) b_date = Date.parse(b.created_at)

          return b_date - a_date

        })

        //give to state
        setNewsFeed(sortedCombinedArray);
        console.log('SORTED COMBINED!:', sortedCombinedArray)


    } catch (error) {
      //fail
      console.error(error);
    }

  };


  useEffect(() => {
    fetchFeedData();

    return () => {
      console.log("unmounts")
    }

  }, [reloadFeed]);


  return (
    <>
      <Head>
        <title>Newsfeed | Spector Trades</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false} sx={{ width: "80%" }}>
          <NewsfeedListToolbar triggerReload={triggerReload}/>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3} >
              {newsFeed.map((article) => (
                <Grid item key={article._id ? article._id : article.id} lg={12} md={12} xs={12} >
                  {article._id ? <NewsfeedCard key={article._id} media={article} /> : <NewsfeedCard key={article.id} media={article} />}
                  {/* {<NewsfeedCard key={article._id} media={article} />} */}
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            {/* <Pagination color="primary" count={3} size="small" /> */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

Newsfeed.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Newsfeed;
