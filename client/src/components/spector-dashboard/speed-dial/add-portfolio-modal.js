import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Typography,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import api from "../../../apis/api";
import { useCookies } from 'react-cookie';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "1px solid #555",
  boxShadow: 24,
  borderRadius: "8px",
};

export const AddPortfolioModal = ({ open, handleClose, refreshDashboardState }) => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [portfolioType, setPortfolioType] = useState('spec');
  const handlePortfolioType = (_event, newPortfolioType) => {
    setPortfolioType(newPortfolioType);
  };
  const [portfolioName, setPortfolioName] = useState('');
  const [specBalance, setSpecBalance] = useState(0);
  const [info, setInfo] = useState({visibility: 'hidden',
                                    severity: 'info',
                                    message: ''});

  const resetForm = () => {
    setPortfolioType('spec');
    setPortfolioName('');
    setSpecBalance(0);
    setInfo({visibility: 'hidden',
      severity: 'info',
      message: ''});
  };

  const resetBeforeClose = () => {
    resetForm();
    handleClose();
  }

  const handleSubmit = () => {
    if (!portfolioName) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Must give portfolio a name!'})
    } else if (portfolioType === 'spec' && (isNaN(specBalance) || specBalance < 1)) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Must give speculative balance a valid number over 0'})
    } else {
      
      const data = { name: portfolioName, live: portfolioType === 'live', spec_money: specBalance ? specBalance : null };
      const token = cookies.spector_jwt;
      const config = {
        headers: { Authorization: `Bearer ${token}`}
      };
      api.post('/portfolios', data, config).then(res => {
        refreshDashboardState();
        resetBeforeClose();
      }).catch(err => {
        console.log('error in posting portfolio: ', err)
        resetBeforeClose();
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={resetBeforeClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={style}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Typography
              color="textSecondary"
              display="inline"
              variant="h5"
            >
              New Portfolio
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

            <ToggleButtonGroup
              value={portfolioType}
              exclusive
              onChange={handlePortfolioType}
              aria-label="portfolio type"
            >
              <ToggleButton value="spec" aria-label="spec">
                Spec
              </ToggleButton>
              <ToggleButton value="live" aria-label="live">
                Live
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

        <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>
          <TextField
            id="portfolio-name"
            label="Portfolio Name"
            placeholder="My Portfolio"
            variant="standard"
            fullWidth={true}
            onChange={(event) => setPortfolioName(() => event.target.value)}
           />
        </Box>
        <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>
          <TextField
            disabled={portfolioType !== 'spec'}
            id="speculative-money"
            label="Speculative Money"
            placeholder="1000"
            variant="standard"
            fullWidth={true}
            onChange={(event) => setSpecBalance(previous => Number(event.target.value))}
          />
        </Box>
          
          {/* THE INFOBOX */}
          <Alert sx={{ visibility: info.visibility }} severity={info.severity}>{info.message}</Alert>
   
          <Divider />
          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

              <Button onClick={handleSubmit} variant="outlined">Create</Button>

          </Box>
        </Box>
      </Card>
    </Modal>
  );
  
}

 