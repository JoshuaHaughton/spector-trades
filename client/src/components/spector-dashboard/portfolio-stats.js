import {  Stack } from '@mui/material';
import { StockProfitStat } from './stock-profit-stat';
import { CryptoProfitStat } from './crypto-profit-stat';
import { SpecBalanceStat } from './spec-balance-stat';

export const PortfolioStats = (props) => {
  const { dashboardState } = props;
  return (
    <Stack spacing={3}
          sx={{height: '100%'}}
          justifyContent='space-between'>
        <StockProfitStat {...props} />
        <CryptoProfitStat {...props} />
        {!dashboardState.portfolioInfo.live && <SpecBalanceStat {...props} />}
    </Stack>
)};
