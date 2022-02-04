import Head from 'next/head';

import { useRouter } from 'next/router';

import { Box, Container, Grid } from '@mui/material';
import { PortfolioTabs } from '../components/spector-dashboard/portfolio-tabs';
import { PortfolioStats } from '../components/spector-dashboard/portfolio-stats';
import { HeroGraph } from '../components/spector-dashboard/hero-graph';
import { GroupedAssets } from '../components/spector-dashboard/grouped-assets';
import { IndividualAssets } from '../components/spector-dashboard/individual-assets';
import {centsToDollars, niceMoney} from '../utils/toHumanDollars';
import { DashboardLayout } from '../components/dashboard-layout';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import api from "../apis/api";
import axios from 'axios';
import { parseCryptoStats } from '../components/helpers/graphDataProfit'
import { getCryptoData, getStocksData } from '../components/helpers/assetData';
import { SpectorSpeedDial } from 'src/components/spector-dashboard/speed-dial';
const Dashboard = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [dashboardState, setDashboardState] = useState({});
  const [activePortfolio, setActivePortfolio] = useState(0);
  const [activeGraphData, setActiveGraphData] = useState({
    options: {},
    series: []
  });
  const [activeStat, setActiveStat] = useState("crypto_profit");
  const [assetPerformanceCrypto, setAssetPerformanceCrypto] = useState({
  });
  const [assetPerformanceStocks, setAssetPerformanceStocks] = useState({
  });
  const [currencyConversion, setCurrencyConversion] = useState({});
  const [statsData, setStatsData] = useState({});
  const [plusMinus, setPlusMinus] = useState({stock: {}, crypto: {}});

  // TODO: REFACTOR!
  const refreshDashboardState = () => {
    const fetchData = async () => {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        const response = await api.get('/dashboard', config).then(response => {
          if (response.status === 200) {
            setDashboardState(response.data);
            if (!activePortfolio) {
              // Set activePortfolio to the first one
              setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);
            }
            return response.data;
          }
        }).then(response => {
          // Check if need to make plusMinus update
          const cryptoAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Cryptocurrency")).flat();
          const stockAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Stocks")).flat();

          const cryptoReduce = cryptoAssets.reduce((prev, curr) => {
            const newObj = {...prev};
            newObj[curr.name] = 0;
            return newObj;
          }, {});

          const stockReduce = stockAssets.reduce((prev, curr) => {
            const newObj = {...prev};
            newObj[curr.symbol] = 0;
            return newObj;
          }, {});

          const cryptoDifference = Object.keys(cryptoReduce).filter(x => Object.keys(plusMinus.crypto).indexOf(x) === -1);
          const stockDifference = Object.keys(stockReduce).filter(x => Object.keys(plusMinus.stock).indexOf(x) === -1);
          // console.log('cryptoDifference', cryptoDifference, 'stockDifference', stockDifference);

          if (cryptoDifference.length > 0) {
            // axios.post('/api/crypto-plus-minus', {id: cryptoDifference}).
            // then(res => setPlusMinus(prev => {
            //   const newCopy = {...prev};
            //   for (const name in res.data) {
            //     newCopy.crypto[name] = res.data[name];
            //   }
            //   return newCopy;
            // }));
            cryptoDifference.forEach(name => {
              setPlusMinus(prev => {
                const newCopy = {...prev};
                newCopy.crypto[name] = (-1 * Math.random() * 10 + 1).toPrecision(5);
                return newCopy;
              });
            })

          }

          if (stockDifference.length > 0) {
            axios.post('/api/stock-plus-minus', {id: stockDifference}).
            then(res => setPlusMinus(prev => {
              const newCopy = {...prev};
              for (const symbol in res.data) {
                newCopy.stock[symbol] = res.data[symbol];
              }
              return newCopy;
            }));
          }

        });
    };
    fetchData();
  };
  

  
  // /auth endpoint returns {success: true, token}
  useEffect(() => {

    //originally async
    const fetchData = async () => {
      try {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        api.get('/dashboard', config).then(response => {
          if (response.status === 200) {

            if (Object.keys(response.data).length !== 0) {
              const promises = [
                getCryptoData(response.data),
                getStocksData(dashboardState, currencyConversion)
              ];
        
              Promise.all(promises)
                .then(result => {
                  console.log("result: ", result);
                })
            }

            setDashboardState(response.data);
            setIsAuthorized(true);
            // get id of first portfolio
            setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);

            setLoading(false);




            return response.data;
          }
        }).then(response => {

          if (response) {

            // console.log('why dont u work');
            // START OF GET + / - DATA
            const cryptoAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Cryptocurrency")).flat();
            const stockAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Stocks")).flat();

            const cryptoReduce = cryptoAssets.reduce((prev, curr) => {
              const newObj = {...prev};
              newObj[curr.name] = 0;
              return newObj;
            }, {});

            const stockReduce = stockAssets.reduce((prev, curr) => {
              const newObj = {...prev};
              newObj[curr.symbol] = 0;
              return newObj;
            }, {});

            // console.log('plus minus: ', cryptoAssets, stockAssets, Object.keys(cryptoReduce));

            if (Object.keys(cryptoReduce).length > 0) {
              // console.log("SHOULD FAKE THE DATA here");
              Object.keys(cryptoReduce).forEach(id => {
                // axios.post('/api/crypto-plus-minus', {id}).
                // then(res => setPlusMinus(prev => {
                //   const newCopy = {...prev};
                //   newCopy.crypto[id] = res.data.plusMinus;
                //   return newCopy;
                // }));
                setPlusMinus(prev => {
                    const newCopy = {...prev};
                    newCopy.crypto[id] = (-1 * Math.random() * 10 + 1).toPrecision(5);
                    return newCopy;
                  });

              })

            }

            if (Object.keys(stockReduce).length > 0) {
              axios.post('/api/stock-plus-minus', {id: Object.keys(stockReduce)}).
              then(res => setPlusMinus(prev => {
                const newCopy = {...prev};
                newCopy.stock = res.data;
                return newCopy;
              }));
            }
            // END OF GET + / - DATA

          }

        }).catch(() => {
          // Response rejected

          // router.push('/home');
          setTimeout(() => {setLoading(false)}, 1000);
        });
      } catch(err) {
      }
    };

    fetchData().then(res => {
      axios.get('/api/currencyConversion')
      .then((resp) => {
        setCurrencyConversion(resp.data);
      })
      .catch(err => {
        console.log("ERROR in currencyConversion call: ", err)
      });
    });

    refreshDashboardState(); // THIS IS FOR PLUS MINUS DEMO, WILL REMOVE LATER
  }, []);

  const createAssetGraphData = (data, name, exitPoint) => {
    let nameLabel = 'Asset';
    if (name) {
      nameLabel = name;
    }

    const seriesOptions = {
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
          text: `${nameLabel} Price Movement`,
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
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMM \'yy',
              day: 'dd MMM',
              hour: 'HH:mm'
            }
          }
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
    };


    if (exitPoint && exitPoint > 0) {
      // console.log('there is an exit point');
      seriesOptions.options['annotations'] = {
        yaxis: [
          {
            y: (exitPoint / 100),
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                color: '#fff',
                background: '#00E396'
              },
              text: `Exit point @ ${exitPoint / 100}`
            }
          }
        ]
      }
    }
    //const dataDates = data.map(d => [new Date(d[0]), d[1]]);
    setActiveGraphData(seriesOptions);
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
            unsoldAssets={
              Object.values(dashboardState).map(p => p.assets).flat(1).filter(a => a.sold === false)
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
                  <PortfolioStats
                    graphData={activeGraphData}
                    activePortfolio={activePortfolio}
                    dashboardState={dashboardState[activePortfolio]}
                    setActiveStat={setActiveStat}
                    statsData={statsData}
                    statsLoading={statsLoading}
                    {...activeGraphData}
                  />
              </Grid>

              {/* THIS IS THE HERO GRAPH COMPONENT */}
              <Grid item
                lg={8}
                md={6}
                xl={9}
                xs={12}>
                  <HeroGraph
                    {...activeGraphData}
                    activeStat={activeStat}
                    setActiveStat={setActiveStat}
                    statsLoading={statsLoading}
                  />
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
                  {activePortfolio !== 0 && <IndividualAssets assets={dashboardState[activePortfolio].assets} createAssetGraphData={createAssetGraphData} plusMinus={plusMinus} />}
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
