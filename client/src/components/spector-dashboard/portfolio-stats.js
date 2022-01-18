import {  Stack } from '@mui/material';
import { ProfitStat } from './profit-stat';
import { GrowthStat } from './growth-stat';
import { SpecBalanceStat } from './spec-balance-stat';

export const PortfolioStats = () => (
   <Stack spacing={3} 
          sx={{height: '100%'}} 
          justifyContent='space-between'>
       <ProfitStat />
       <GrowthStat />
       <SpecBalanceStat />
   </Stack>
  );