import { useState } from 'react';
import { Backdrop } from '@mui/material';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { AddPortfolioModal } from './speed-dial/add-portfolio-modal';
import { AddInvestmentModal } from './speed-dial/add-investment-modal';
import { SellInvestmentModal } from './speed-dial/sell-investment-modal';

export const SpectorSpeedDial = ({refreshDashboardState, portfolios, unsoldAssets}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false);
  const handleAddPortfolioOpen = () => setAddPortfolioOpen(true);
  const handleAddPortfolioClose = () =>  setAddPortfolioOpen(false);

  const [addInvestmentOpen, setAddInvestmentOpen] = useState(false);
  const handleAddInvestmentOpen = () => setAddInvestmentOpen(true);
  const handleAddInvestmentClose = () =>  setAddInvestmentOpen(false);

  const [sellInvestmentOpen, setSellInvestmentOpen] = useState(false);
  const handleSellInvestmentOpen = () => setSellInvestmentOpen(true);
  const handleSellInvestmentClose = () =>  setSellInvestmentOpen(false);
  
  const actions = [
    { icon: <SaveIcon />, name: 'Add Investment', handle: handleAddInvestmentOpen },
    { icon: <FileCopyIcon />, name: 'Add Portfolio', handle: handleAddPortfolioOpen },
    { icon: <PrintIcon />, name: 'Sell Investment', handle: handleSellInvestmentOpen },
  ];

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.speedDial - 1 }} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            FabProps={{disabled: (action.name === 'Add Investment' && !portfolios) || (action.name === 'Sell Investment' && !unsoldAssets) }}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handle}
          />
        ))}
      </SpeedDial>
      <AddPortfolioModal
        open={addPortfolioOpen}
        handleClose={handleAddPortfolioClose}
        refreshDashboardState={refreshDashboardState}
      />
      {portfolios && (
          <AddInvestmentModal
            portfolios={portfolios}
            open={addInvestmentOpen}
            handleClose={handleAddInvestmentClose}
            refreshDashboardState={refreshDashboardState}
          />
        )
      }
      {
        unsoldAssets && (
          <SellInvestmentModal
            portfolios={portfolios}
            unsoldAssets={unsoldAssets}
            open={sellInvestmentOpen}
            handleClose={handleSellInvestmentClose}
            refreshDashboardState={refreshDashboardState}
          />
        )
      }

    </>
  );
}