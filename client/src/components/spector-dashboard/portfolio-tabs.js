import { Tabs, Tab} from '@mui/material';
import { useState } from 'react';

export const PortfolioTabs = ({portfolios, activePortfolio, setActivePortfolio, getAssetPerformanceData}) => {
    const handleChange = (event, newValue) => {
      setActivePortfolio(newValue);
      getAssetPerformanceData()
    };

    return (
      <Tabs
      value={activePortfolio}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
        {portfolios.map(p => <Tab key={p.id} label={p.name} value={p.id} /> )}
      </Tabs>
    );
  };
