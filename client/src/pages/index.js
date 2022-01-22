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
import { SpectorSpeedDial } from 'src/components/spector-dashboard/speed-dial';
import centsToDollars from '../utils/toHumanDollars';
const Dashboard = () => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardState, setDashboardState] = useState({});
  const [activePortfolio, setActivePortfolio] = useState(0);
  const [activeGraphData, setActiveGraphData] = useState({
    options: {},
    series: []
  });
  const [activeStat, setActiveStat] = useState("");
  console.log("activeStat: ", activeStat)
  // console.log("active graph: ", activeGraphData);
  // console.log("activePortfolio: ", activePortfolio);
  console.log("dashboardState: ", dashboardState);
  // console.log("activeDashboard: ", dashboardState[activePortfolio]);
  // TODO: REFACTOR!
  const refreshDashboardState = () => {
    const fetchData = async () => {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        const response = await api.get('/dashboard', config).then(response => {
          // console.log("auth data", response.data)
          if (response.status === 200) {
            setDashboardState(response.data);
            if (!activePortfolio) {
              // Set activePortfolio to the first one
              setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);
            }
          }
        })
    };
    fetchData();
  };


  useEffect(() => {
    const data = [];
    const xData = [];
    let tmp = [];
    let yMax;
    if (activeStat === 'spec_money') {
      yMax = (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) + (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) * 0.1)) / 100
      // dashboardState[activePortfolio]
      data.push((Number(dashboardState[activePortfolio].portfolioInfo.spec_money)) / 100)
      xData.push(dashboardState[activePortfolio].portfolioInfo.created_at)
      dashboardState[activePortfolio].assets.forEach((item, i) => {
        if (!item.sold) {
          data.push((data[i] - ((item.price_at_purchase * item.units) / 100)))
        }

        if (item.sold) {
          data.push((data[i] + ((item.price_at_purchase * item.units) / 100)))
        }
        xData.push(item.created_at)
      });
      // console.log("data: ", data)
      // console.log("Xdata: ", xData)
      // console.log("Y max: ", yMax);
    }

    if (activeStat === "growth") {

    }
    setActiveGraphData({
      series: [{
        name: "Spec money",
        data,
      }],
      options: {
        stroke: {
          show: true,
          curve: activeStat ? 'straight' : 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          max: yMax,
          labels: {
            formatter: function (val) {
              return val.toFixed();
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
          name: 'date',
          categories: xData
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val.toFixed(2));
            }
          }
        }
      }
    });
    // console.log(activeGraphData)
  }, [activeStat]);
  // /auth endpoint returns {success: true, token}
  useEffect(() => {

    //originally async
    const fetchData = async () => {
      try {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        console.log( config )
        api.get('/dashboard', config).then(response => {
          // console.log("auth data", response.data)
          if (response.status === 200) {
            setDashboardState(response.data);
            setIsAuthorized(true);
            // get id of first portfolio
            setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);
            
            setLoading(false);
            parseGraphData(activePortfolio);
          }
        }).catch(() => {
          // Response rejected
          setTimeout(() => {setLoading(false)}, 1000);
        });
      } catch(err) {
      }
    };

    fetchData();

  }, []);

  // useEffect, use axios to call the auth endpoint using our jwt token
  // auth endpoint validates the token, if returns true.. setIsAuthorized to true
  //
    // if (!isAuthorized) {
    //   console.log("is authed: ", isAuthorized)
    //   console.log("has authorized token");
    //   return <div>Unauthorized user</div>
    // }

  const parseGraphData = (activePortfolio) => {
    setActiveGraphData({
      series: [{
        name: "price",
        data: [6629.81, 6632.01]
      }],
      options: {
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val;
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
          name: 'date',
          categories: ['01-02-2020', '02-01-2022']
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      }
    });
  };

  const createAssetGraphData = (data) => {
    setActiveGraphData({
      series: [{
        name: "price",
        data: data,
      }],
      options: {
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Asset Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              if (val < 1) {
                return val.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
              }
              return val;
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
          name: 'date',
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      }
    });
  };

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

    if (isAuthorized && Object.keys(dashboardState).length === 0) {
      return (         
        <SpectorSpeedDial 
          refreshDashboardState={refreshDashboardState}
        />
      );

    }

    if (isAuthorized) {
      return (
        <>
          {/* THIS IS THE SPEED DIAL ACTION BUTTON */}
          <SpectorSpeedDial 
            refreshDashboardState={refreshDashboardState} 
            portfolios={
              Object.values(dashboardState).map(portfolio => portfolio.portfolioInfo)
            }
          />

          {/* THIS IS THE PORTFOLIO TAB */}
          <Container maxWidth={false}>
            <PortfolioTabs
              portfolios={
                Object.values(dashboardState).map(portfolio => portfolio.portfolioInfo)
              }
              {...{activePortfolio, setActivePortfolio}}
              />
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
                  <PortfolioStats {...dashboardState[activePortfolio]} setActiveStat={setActiveStat}/>
              </Grid>

              {/* THIS IS THE HERO GRAPH COMPONENT */}
              <Grid item
                lg={8}
                md={6}
                xl={9}
                xs={12}>
                  <HeroGraph {...activeGraphData} />
              </Grid>

              {/* THIS IS THE GROUPED ASSET STATS COMPONENT */}
              <Grid item
                lg={5}
                md={6}
                xl={4}
                xs={12}>
                  {activePortfolio !== 0 && <GroupedAssets assets={dashboardState[activePortfolio].assets} createAssetGraphData={createAssetGraphData} />}
              </Grid>

              {/* THIS IS THE INDIVIDUAL ASSET STATS COMPONENT */}
              <Grid item
                lg={7}
                md={6}
                xl={8}
                xs={12}>
                  {activePortfolio !== 0 && <IndividualAssets assets={dashboardState[activePortfolio].assets} createAssetGraphData={createAssetGraphData} />}
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
