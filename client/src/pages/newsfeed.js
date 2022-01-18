import Head from "next/head";
import { useState, useEffect } from "react";
const axios = require("axios");
import { Box, Container, Grid, Pagination } from "@mui/material";
import { newsfeedPosts } from "../__mocks__/newsfeedposts";
import { NewsfeedListToolbar } from "../components/newsfeed/newsfeed-list-toolbar";
import { NewsfeedCard } from "../components/newsfeed/newsfeed-card";
import { DashboardLayout } from "../components/dashboard-layout";

const Newsfeed = () => {
  const [newsArrays, setNewsArrays] = useState([]);

  //region must be one of the following: US|BR|AU|CA|FR|DE|HK|IN|IT|ES|GB|SG

  const options = {
    method: 'GET',
    url: 'https://free-news.p.rapidapi.com/v1/search',
    params: {q: 'Crypto', lang: 'en'},
    headers: {
      'x-rapidapi-host': 'free-news.p.rapidapi.com',
      'x-rapidapi-key': 'f539cc1d29msh63171028d7f006ep13a356jsn42c6f4e0afe0'
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        await axios.request(options).then(function (response) {
          //success

          //shows array in order of most recent, excluding those that have yet to be posted (future dates)
          const sortedNewsArrays = response.data.articles.sort((a, b) => Date.parse(b.published_date) - Date.parse(a.published_date))
          const today = new Date();
          const filteredArticles = sortedNewsArrays.filter(article => Date.parse(article.published_date) < Date.parse(today))

          setNewsArrays(filteredArticles);
          console.log(filteredArticles);
        })
      } catch (error) {
        //fail
        console.error(error);
      }
    };
    fetchNews();
  }, []);

  // const fetchNews = () => {
  //   try {
  //     axios.request(options).then(function (response) {
  //       //success

  //       setNewsArrays(response.data.news);
  //       console.log(newsArrays);
  //     });
  //   } catch (error) {
  //     //fail
  //     console.error(error);
  //   }
  // };
  // fetchNews();

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
        <Container maxWidth={false}>
          <NewsfeedListToolbar />
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {newsArrays.map((article) => (
                <Grid item key={article.uuid} lg={12} md={12} xs={12}>
                  <NewsfeedCard key={article._id} product={article} />
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
