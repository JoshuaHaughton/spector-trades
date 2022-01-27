import { Tab, Tabs } from '@mui/material';

import { useEffect, useState } from 'react';

export const GroupedAssetsTabs = ({assets, setName, handleCreateAssetGraphData}) => {
  const [value, setValue] = useState(assets[0]);
  const handleChange = (_event, newValue) => {
    setValue(newValue);
    setName(() => newValue);
  };

  useEffect(() => {
    if (!assets.includes(value)) {
      setValue(() => assets[0]);
    }
  }, [assets])

  return (
    <Tabs
    value={(assets.includes(value) ? value : false)}
    onChange={handleChange}
    variant="scrollable"
    scrollButtons="auto"
    aria-label="scrollable auto tabs example"
  >
      {assets.map(g => <Tab key={g} label={g} value={g} onClick={() => handleCreateAssetGraphData(g)}  />)}
    </Tabs>
  );
};