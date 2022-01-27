import api from "../../../apis/api";
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
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { CryptoAutoComplete } from "./crypto-autocomplete";
import { StockAutoComplete } from "./stock-autocomplete";

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

export const AddInvestmentModal = ({ open, handleClose, portfolios, refreshDashboardState }) => {
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
  const [assetSelection, setAssetSelection] = useState({});
  const [assetQuantity, setAssetQuantity] = useState(0);
  const [exitPoint, setExitPoint] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const handleAssetType = (_event, newAssetType) => {
    if (newAssetType !== null) {
      setAssetSelection({});
      setAssetType(newAssetType);
    }
  };

  const portfolioItems = portfolios.map(p => ({id: p.id, label: p.name, live: p.live}));

  useEffect(() => {
    if (assetSelection && assetSelection['price']) {
      setTotalValue(assetSelection.price * assetQuantity);
    } else {
      setTotalValue(0);
    }
  }, [assetSelection, assetQuantity]);

  const resetForm = () => {
    setPortfolioSelection(null);
    setTotalValue(0);
    setAssetSelection(null);
    setAssetQuantity(0);
    setExitPoint(0);
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
    } else if (assetQuantity < 1) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Asset quantity must be at least 1!'});
    } else if (totalValue < 1) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Total purchase must be at least 1 cent!'});
    } else if (exitPoint > 0 && exitPoint * 100 <= assetSelection.price) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Exit point must be greater than asset price!'});
    } else {
      const data = {
        name: portfolioSelection.label, 
        live: portfolioSelection.live,
        asset_name: assetSelection.asset_name, 
        asset_symbol: assetSelection.code, 
        type: assetSelection.type,
        exit_point: exitPoint * 100,
        units: assetQuantity,
        price_at_purchase: assetSelection.price,
        sold: false,
      };
      const token = cookies.spector_jwt;
      const config = {
        headers: { Authorization: `Bearer ${token}`}
      };
      api.post('/orders', data, config).then(res => {
        handleSnackbarMessage('Successfully added an investment!', 'success');
        refreshDashboardState();
        resetBeforeClose();
      }).catch(err => {
        handleSnackbarMessage('Oops! Something happened, please try again.', 'error');
        console.log('error in posting asset order: ', err)
        resetBeforeClose();
      });
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
                New Investment
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
              <ToggleButtonGroup
                exclusive
                aria-label="asset type"
                value={assetType}
                onChange={handleAssetType}
              >
                <ToggleButton value="stock" aria-label="stock">
                  Stock
                </ToggleButton>
                <ToggleButton value="crypto" aria-label="srypto">
                  Crypto
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ display:'flex', p: 2, justifyContent: 'center', gap: 2 }}>

              { assetType === 'stock' && <StockAutoComplete setAssetSelection={setAssetSelection} /> }  
              { assetType === 'crypto' && <CryptoAutoComplete setAssetSelection={setAssetSelection} /> } 

              <TextField variant="standard" 
                id="quantity"
                placeholder="1"
                helperText=" "
                label="Quantity"
                onBlur={(event) => setAssetQuantity(prev => {
                    // Ensures the input is a number
                    if (isNaN(event.target.value)) {
                      event.target.value = prev;
                      return prev;
                    }
                    return Number(event.target.value);
                  }
                )}
              />  

            </Box>

            <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>
              <TextField
                id="exit-point"
                label="Exit Point"
                placeholder="1"
                variant="standard"
                onBlur={(event) => setExitPoint(prev => {
                    // Ensures the input is a number
                    if (isNaN(event.target.value)) {
                      event.target.value = prev;
                      return prev;
                    }
                    return Number(event.target.value);
                  }
                )}
              />
            </Box>

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
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

      <Snackbar open={snackbarOpen} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center' }} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          { snackbarMessage }
        </Alert>
      </Snackbar>
    </>
  );
  
}