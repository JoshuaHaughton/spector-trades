import Head from 'next/head';
import { Box, Card, CardContent, Container, Grid} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import api from "../apis/api";
import { PortfolioTabs } from '../components/spector-dashboard/portfolio-tabs';
import { PortfolioStats } from '../components/spector-dashboard/portfolio-stats';
import { HeroGraph } from '../components/spector-dashboard/hero-graph';
import { GroupedAssets } from '../components/spector-dashboard/grouped-assets';
import { IndividualAssets } from '../components/spector-dashboard/individual-assets';

const SpectorDashboard = () => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
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
        <PortfolioTabs />
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
              <PortfolioStats />
          </Grid>

          {/* THIS IS THE HERO GRAPH COMPONENT */}
          <Grid item
            lg={8}
            md={6}
            xl={9}
            xs={12}>
              <HeroGraph />
          </Grid>

          {/* THIS IS THE GROUPED ASSET STATS COMPONENT */}
          <Grid item
            lg={5}
            md={6}
            xl={4}
            xs={12}>
              <GroupedAssets />
          </Grid>

          {/* THIS IS THE INDIVIDUAL ASSET STATS COMPONENT */}
          <Grid item
            lg={7}
            md={6}
            xl={8}
            xs={12}>
              <IndividualAssets />
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
