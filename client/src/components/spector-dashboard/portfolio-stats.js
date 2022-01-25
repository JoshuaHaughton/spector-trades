import {  Stack } from '@mui/material';
import { StockProfitStat } from './stock-profit-stat';
import { CryptoProfitStat } from './crypto-profit-stat';
import { SpecBalanceStat } from './spec-balance-stat';

export const PortfolioStats = (props) => {
  const { dashboardState, statsData } = props;

  return (
    <Stack spacing={3}
          sx={{height: '100%'}}
          justifyContent='space-between'>
        <CryptoProfitStat {...props} />
        <StockProfitStat {...props} />
        <SpecBalanceStat {...props} />
    </Stack>
)};
