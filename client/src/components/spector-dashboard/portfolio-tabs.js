import { Tabs, Tab} from '@mui/material';
import { useState } from 'react';

export const PortfolioTabs = ({portfolios}) => {
    const [value, setValue] = useState(0);  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
        {portfolios.map(p => <Tab key={p.id} label={p.name} /> )}
      </Tabs>
    ); 
  };