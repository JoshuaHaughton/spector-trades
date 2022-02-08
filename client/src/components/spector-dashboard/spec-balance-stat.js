import { Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';
import {centsToDollars} from '../../utils/toHumanDollars';
export const SpecBalanceStat = (props) => {
  const {dashboardState} = props;
  const handleClick = (e) => {
    e.preventDefault();
    if (dashboardState.portfolioInfo.live) {
      return;
    }
    props.setActiveStat("spec_money")
  };
  return (
    <button
    className={
      !dashboardState.portfolioInfo.live ? 'stats' : 'stats-disabled'
    }
    onClick={handleClick}>
        <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            SPEC BUCKS LEFT
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            ${centsToDollars(dashboardState.spec_money_left)}
          </Typography>
          <Typography
            color="textSecondary"
            variant="h6"
          >
{`out of $${centsToDollars(dashboardState.portfolioInfo.spec_money)}`}
          </Typography>
        </Grid>
        <Grid item>
          <AccountBalanceIcon
            sx={{
              backgroundColor: 'none',
              colorPrimary: 'primary',
              height: 56,
              width: 56
            }}
          >
            <InsertChartIcon />
          </AccountBalanceIcon>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          color='primary'
          value={Number((dashboardState.spec_money_left)/dashboardState.portfolioInfo.spec_money * 100)}
          variant="determinate"
        />
      </Box>
    </CardContent>
  </Card>
    </button>
)};
