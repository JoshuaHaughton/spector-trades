import api from "../../../apis/api";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Typography,
  Modal,
  TextField,
  Autocomplete,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { AssessmentSharp } from "@mui/icons-material";

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

const getAssetsByPortfolio = (assets) => {
  const assetsByPortfolio = {};
  assets.forEach(a => {
    if (!assetsByPortfolio[a.portfolio_id]) {
      assetsByPortfolio[a.portfolio_id] = [];
    }
    assetsByPortfolio[a.portfolio_id].push(a);
  });
  return assetsByPortfolio;
}; 

export const SellInvestmentModal = ({ open, handleClose, portfolios, refreshDashboardState, unsoldAssets }) => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  }
  const handleSnackbarMessage = (message, severity) => {
    setSnackbarOpen(true);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  const [portfolioSelection, setPortfolioSelection] = useState(null);
  const [info, setInfo] = useState({visibility: 'hidden',
                                    severity: 'info',
                                    message: ''});
  const [totalValue, setTotalValue] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [assetSelection, setAssetSelection] = useState(null);
  const [assetList, setAssetlist] = useState([]);
  const [priceHelperText, setPriceHelperText] = useState(' ');

  const assetsByPortfolio = getAssetsByPortfolio(unsoldAssets);
  const portfolioItems = portfolios.map(p => ({id: p.id, label: p.name, live: p.live})).filter(p => assetsByPortfolio[p.id] );
  
  useEffect(() => {
    if (portfolioSelection) {
      console.log(portfolioSelection);
      setAssetlist(assetsByPortfolio[portfolioSelection.id].map(a => ({label: `${a.symbol} - ${a.units} @ $${(a.price_at_purchase / 100).toFixed(2)}`, ...a})  ));
    } else {
      setAssetlist([]);
    }
    setPriceHelperText(' ');
    setAssetSelection(null);
    setTotalValue(0);
    
  }, [portfolioSelection]);

  useEffect(() => {
    if (assetSelection && assetSelection.type === 'Cryptocurrency') {
      axios.post('/api/crypto', {id: assetSelection.name}).then(res => {
        const price = Object.values(res.data)[0]['cad'];
        setPriceHelperText(`now @ $${price.toFixed(2)}`);
        setTotalValue((price * 100 * assetSelection.units));
        setTotalReturn((price * 100) * assetSelection.units - (assetSelection.price_at_purchase * assetSelection.units));
      });
    } else {
      setPriceHelperText(' ');
      setTotalValue(0);
      setTotalReturn(0);
    }
  }, [assetSelection]);

  const resetForm = () => {
    setPortfolioSelection(null);
    setTotalValue(0);
    setTotalReturn(0);
    setAssetSelection(null);
    setInfo({visibility: 'hidden',
      severity: 'info',
      message: ''});
  };

  const resetBeforeClose = () => {
    resetForm();
    handleClose();
  }

  const handleSubmit = () => {
    if (!portfolioSelection) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Must select portfolio!'});
    } else if (!assetSelection) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Must select asset!'});
    } else {
      handleSnackbarMessage('Successfully sold an investment!', 'success');
      refreshDashboardState();
      resetBeforeClose();
    //   const data = {
    //     name: portfolioSelection.label, 
    //     live: portfolioSelection.live,
    //     asset_name: assetSelection.asset_name, 
    //     asset_symbol: assetSelection.code, 
    //     type: assetSelection.type,
    //     exit_point: exitPoint * 100,
    //     units: assetQuantity,
    //     price_at_purchase: assetSelection.price,
    //     sold: false,
    //   };
    //   const token = cookies.spector_jwt;
    //   const config = {
    //     headers: { Authorization: `Bearer ${token}`}
    //   };
    //   api.post('/orders', data, config).then(res => {
    //     handleSnackbarMessage('Successfully added an investment!', 'success');
    //     refreshDashboardState();
    //     resetBeforeClose();
    //   }).catch(err => {
    //     handleSnackbarMessage('Oops! Something happened, please try again.', 'error');
    //     console.log('error in posting asset order: ', err)
    //     resetBeforeClose();
    //   });
    }
  };

  return (
    <>
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
                Sell Investment
              </Typography>

              <IconButton
                aria-label="close"
                onClick={resetBeforeClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />

            <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

              <Autocomplete 
                disablePortal
                id="portfolio-select"
                options={portfolioItems}
                sx={{ width: 250 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={
                  (params) => <TextField variant="standard" {...params} label="Portfolio" />
                }
                onChange={(_event, value) => {
                  setPortfolioSelection(value);
                }}
              />

            </Box>

            <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

              <Autocomplete
                disabled={!portfolioSelection} 
                disablePortal
                id="asset-select"
                options={assetList}                
                sx={{ width: 250 }}
                value={assetSelection}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={
                  (params) => <TextField variant="standard" helperText={priceHelperText} {...params} label="Assets" />
                }
                onChange={(_event, value) => {
                  setAssetSelection(value);
                }}
              />

            </Box>

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                color="textSecondary"
                display="inline"
                variant="h5"
              >
                Return: ${(totalReturn / 100).toFixed(2)}
              </Typography>

              <Typography
                color="textSecondary"
                display="inline"
                variant="h5"
              >
                Total: ${(totalValue / 100).toFixed(2)}
              </Typography>
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

      <Snackbar open={snackbarOpen} autoHideDuration={3000} anchorOrigin={{vertical: 'top', horizontal: 'center' }} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          { snackbarMessage }
        </Alert>
      </Snackbar>
    </>
  );
  
}