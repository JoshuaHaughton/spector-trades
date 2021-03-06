import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, useTheme, CircularProgress } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { deepPurple } from '@mui/material/colors';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyIcon from '@mui/icons-material/Money';
import BlurOnIcon from '@material-ui/icons/BlurOn';
// Required to get react-apexcharts to work
import dynamic from 'next/dynamic'
const Chart = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
);
export const HeroGraph = (props) => {
  const {activeStat} = props;
  const theme = useTheme();
  let statName = '';
  let color= '';
  let height = 30;
  let width = 30;
  let typeOfGraph;
  switch(activeStat) {
    case "spec_money":
      statName = "Speculative Cash";
      color = 'none';
      height = 30;
      width = 30;
      typeOfGraph = 'area';
      break;
    case "stock_profit":
      statName = "Stock profit";
      color = 'error.main';
      height = 30;
      width = 30;
      typeOfGraph = 'area';
      props.series.length !== 0 && props.series[0].data.sort(function(a, b) {
        return Date.parse(a.x) - Date.parse(b.x);
      });
      break;
    case "crypto_profit":
      statName = "Cryptocurrency profit";
      color = deepPurple[500];
      height = 30;
      width = 30;
      typeOfGraph = 'area';
      props.series.length !== 0 && props.series[0].data.sort(function(a, b) {
        return Date.parse(a.x) - Date.parse(b.x);
      });
      break;
    default:
      statName = "Cryptocurrency profit";
      color = deepPurple[500];
      height = 30;
      width = 30;
      typeOfGraph = 'area';
      break;
  }

  const handleClick = (e) => {
    e.preventDefault();
    props.setActiveStat("stock_profit")
  };
  return (
    <Card {...props}>
      <CardHeader
        title={statName}
        action={(
          <Avatar
            sx={{
              backgroundColor: color,
              colorPrimary: 'primary',
              height: height,
              width: width
            }}
          >
            {statName === "Stock profit" && <MoneyIcon />}
            {statName === "Cryptocurrency profit" && <BlurOnIcon />}
            {statName === "Speculative Cash" && <AccountBalanceIcon />}
          </Avatar>
        )}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          {/* INSERT STOCK CHART HERE */}
          {props.statsLoading === false && props.series && <Chart options={props.options} series={props.series} type={typeOfGraph} height={400} />}
          {props.statsLoading === true && (
            <Box
              height={400}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
            <CircularProgress size={100}/>
            </Box>
          )}
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          onClick={handleClick}
        >
          Back to stock profit
        </Button>
      </Box>
    </Card>
  );
};
