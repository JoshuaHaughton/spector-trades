import Head from 'next/head';
import { Box, Container, Grid, Tabs, Tab} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import api from "../apis/api";


const SpectorDashboard = () => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // /auth endpoint returns {success: true, token}
  useEffect(() => {

    //originally async
    const fetchData = async () => {
      try {
        const response = await api.post('/auth', {jwt_token: cookies.spector_jwt}).then(response => {
          if (response.data['success']) {
            setIsAuthorized(true);
          }
        })
        console.log(response.data)
      } catch(err) {
  
      }
    };

    fetchData();
    
  }, []);

  // useEffect, use axios to call the auth endpoint using our jwt token
  // auth endpoint validates the token, if returns true.. setIsAuthorized to true
  // 
    if (!isAuthorized) {
      console.log("has authorized token");
      return <div>Unauthorized user</div>
    }

  return (
  <>
    <Head>
      <title>
        Dashboard | Spector Trades
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      {/* THIS IS THE PORTFOLIO TAB */}
      <Container maxWidth={false}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          centered
        >
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
          <Tab label="Item Four" />
          <Tab label="Item Five" />
          <Tab label="Item Six" />
          <Tab label="Item Seven" />
        </Tabs>
      </Container>

    
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          {/* THIS IS THE PORTFOLIO STATS COMPONENT */}
          <Grid item
            lg={4}
            md={6}
            xl={3}
            xs={12}>
          </Grid>

          {/* THIS IS THE HERO GRAPH COMPONENT */}
          <Grid item
            lg={8}
            md={6}
            xl={9}
            xs={12}>
          </Grid>

          {/* THIS IS THE GROUPED ASSET STATS COMPONENT */}
          <Grid item
            lg={4}
            md={6}
            xl={3}
            xs={12}>
          </Grid>

          {/* THIS IS THE INDIVIDUAL ASSET STATS COMPONENT */}
          <Grid item
            lg={8}
            md={6}
            xl={9}
            xs={12}>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);};

SpectorDashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpectorDashboard;
