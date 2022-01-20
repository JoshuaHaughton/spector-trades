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
  Autocomplete
} from "@mui/material";

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

const portfolioItems = [
  { label: 'Clean Tech', id: 1},
  { label: 'Bio Fuel', id: 2},
  { label: 'Stonks', id: 3},
  { label: 'Mining', id: 4},
  { label: 'Rainy Day', id: 5},
];

const assetItems = [
  { code: 'AAPL', label: 'AAPL - Apple Inc. Common Stock - $168.74', price: 16874},
  { code: 'MSFT', label: 'MSFT - Microsoft Corporation Common Stock - $309.53', price: 30953},
  { code: 'GOOG', label: 'GOOG - Alphabet Inc. Class C Capital Stock - $2760.66', price: 276066},
  { code: 'AMZN', label: 'AMZN - Amazon.com, Inc. Common Stock - $3161.00', price: 316100},
  { code: 'TSLA', label: 'TSLA - Tesla, Inc. Common Stock - $1016.00', price: 101600},
];

export const AddInvestmentModal = ({ open, handleClose }) => {
  const [portfolioId, setPortfolioId] = useState('');
  const [info, setInfo] = useState({visibility: 'hidden',
                                    severity: 'info',
                                    message: ''});
  const [totalValue, setTotalValue] = useState(0);
  const [assetSelection, setAssetSelection] = useState({});
  const [assetQuantity, setAssetQuantity] = useState(0);
  const [exitPoint, setExitPoint] = useState('');
  
  useEffect(() => {
    if (assetSelection && assetSelection['price']) {
      setTotalValue(assetSelection.price * assetQuantity);
    } else {
      setTotalValue(0);
    }
  }, [assetSelection, assetQuantity]);

  const resetForm = () => {
    setPortfolioId('');
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
    console.log('portfolio submitted!');
    resetBeforeClose();
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
              New Investment
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

            <Autocomplete 
              disablePortal
              id="portfolio-select"
              options={portfolioItems}
              sx={{ width: 250 }}
              renderInput={
                (params) => <TextField variant="standard" {...params} label="Portfolio" />
              }
              onChange={(_event, value) => {
                setPortfolioId(value.id);
              }}
            />

          </Box>

          <Box sx={{ display:'flex', p: 2, justifyContent: 'center', gap: 2 }}>

            <Autocomplete 
              disablePortal
              id="asset-select"
              options={assetItems}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField variant="standard" {...params} label="Asset" />}
              onChange={(_event, value) => {
                setAssetSelection(value);
                if (!isNaN(assetQuantity)) {
                  //setTotalValue(value.price * assetQuantity)
                }
              }}
            />

            <TextField variant="standard" 
              id="quantity"
              placeholder="1"
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
  );
  
}