import { Tabs, Tab} from '@mui/material';
import { useState } from 'react';

<<<<<<< HEAD
export const PortfolioTabs = () => {
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
      <Tabs
      value={value}
=======
export const PortfolioTabs = ({portfolios, activePortfolio, setActivePortfolio, getAssetPerformanceData}) => {
    const handleChange = (event, newValue) => {
      setActivePortfolio(newValue);
    };

    return (
      <Tabs
      value={activePortfolio}
>>>>>>> main-dev
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
<<<<<<< HEAD
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
        <Tab label="Item Four" />
        <Tab label="Item Five" />
        <Tab label="Item Six" />
        <Tab label="Item Seven" />
      </Tabs>
    ); 
  };
=======
        {portfolios.map(p => <Tab key={p.id} label={p.name} value={p.id} /> )}
      </Tabs>
    );
  };
>>>>>>> main-dev
