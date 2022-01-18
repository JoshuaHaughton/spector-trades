import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { PortfolioTabs } from '../components/spector-dashboard/portfolio-tabs';
import { PortfolioStats } from '../components/spector-dashboard/portfolio-stats';
import { HeroGraph } from '../components/spector-dashboard/hero-graph';
import { GroupedAssets } from '../components/spector-dashboard/grouped-assets';
import { IndividualAssets } from '../components/spector-dashboard/individual-assets';
import { DashboardLayout } from '../components/dashboard-layout';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import api from "../apis/api";

const Dashboard = () => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await api.post('/auth', {jwt_token: cookies.spector_jwt}).then(response => {

          if (response.data['success']) {
            setIsAuthorized(true);
            setLoading(false);
          } else {
            setTimeout(() => {setLoading(false)}, 1000);

          }
        })

        console.log(response.data)


      } catch(err) {

      }
    };

    fetchData();

  }, []);

  const authorizedDashboard = () => {
    if (loading) {
      return(
      <Container
        t="2"
      >
        <LinearProgress />
      </Container>
      )
    }
    if (isAuthorized) {
      return (
        <>
          <Container maxWidth={false}>
            <PortfolioTabs />
          </Container>


          <Container maxWidth={false}>
            <Grid
              container
              spacing={3}
            >
              <Grid item
                lg={4}
                md={6}
                xl={3}
                xs={12}>
                  <PortfolioStats />
              </Grid>

              <Grid item
                lg={8}
                md={6}
                xl={9}
                xs={12}>
                  <HeroGraph />
              </Grid>

              <Grid item
                lg={5}
                md={6}
                xl={4}
                xs={12}>
                  <GroupedAssets />
              </Grid>

              <Grid item
                lg={7}
                md={6}
                xl={8}
                xs={12}>
                  <IndividualAssets />
              </Grid>
            </Grid>
          </Container>
        </>
      );
    }

    return (<div>Unauthorized user</div>);
  };


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


        {authorizedDashboard()}
    </Box>
  </>
);};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
