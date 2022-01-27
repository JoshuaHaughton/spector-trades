import Head from "next/head";
import { useState, useEffect } from "react";
const axios = require("axios");
import { Box, Container, Grid } from "@mui/material";
import { NewsfeedListToolbar } from "../components/newsfeed/newsfeed-list-toolbar";
import { NewsfeedCard } from "../components/newsfeed/newsfeed-card";
import { DashboardLayout } from "../components/dashboard-layout";
import { useCookies } from "react-cookie";
import { Tab, Tabs } from "@mui/material";
import { fetchFeedData } from "src/components/helpers/newsfeed-helpers";

const Newsfeed = () => {
  const [newsFeed, setNewsFeed] = useState({ posts: [] });
  const [currentFeed, setCurrentFeed] = useState([]);
  const [cookies, setCookie] = useCookies();
  const [reloadFeed, setReloadFeed] = useState(false);

  const triggerReload = () => {
    reloadFeed ? setReloadFeed(false) : setReloadFeed(true);
  };


  // TAB STATE
  const [tabValue, setTabValue] = useState("posts");
  const [symbols, setSymbols] = useState([]);
  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
    console.log('TAB', newValue)
  };



  useEffect(async () => {

      await fetchFeedData(setSymbols, setNewsFeed, cookies)

      console.log('WHY', tabValue)


    return () => {
      console.log("unmounts");
    };

  }, [reloadFeed]);



  useEffect(() => {
    // loadCard()
    setTabValue(tabValue);

  }, [newsFeed])


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
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="wrapped label tabs example"
              centered
            >
              {symbols.map((s) => (
                <Tab key={s} value={s} label={s} />
              ))}
            </Tabs>
          </Box>
          <NewsfeedListToolbar triggerReload={triggerReload} />
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* {currentFeed} */}
              {newsFeed[tabValue] && newsFeed[tabValue].map((article) => {
                if (article._id) {
                  return (
                    <Grid item key={article._id} lg={12} md={12} xs={12}>
                      <NewsfeedCard key={article._id} media={article} />
                    </Grid>
                  );
                }
                return (
                    <Grid item key={article.id} lg={12} md={12} xs={12}>
                      <NewsfeedCard key={article.id} media={article} />
                    </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          ></Box>
        </Container>
      </Box>
    </>
  );
};

Newsfeed.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Newsfeed;
