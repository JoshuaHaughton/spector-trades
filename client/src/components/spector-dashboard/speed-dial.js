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




export const SpectorSpeedDial = () => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const handleAddCommentOpen = () => setAddCommentOpen(true);
  const handleAddCommentClose = () =>  setAddCommentOpen(false);

  const handlePortfolioModal = () => {
    handleClose();
    handleAddCommentOpen();
  };

  const handleInvestmentModal = () => console.log('handling modal');
  
  const actions = [
    { icon: <SaveIcon />, name: 'Add Investment', handle: handleInvestmentModal },
    { icon: <FileCopyIcon />, name: 'Add Portfolio', handle: handlePortfolioModal },
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
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handle}
          />
        ))}
      </SpeedDial>
      <AddPortfolioModal
        open={addCommentOpen}
        handleClose={handleAddCommentClose}
      />
    </>
  );
}