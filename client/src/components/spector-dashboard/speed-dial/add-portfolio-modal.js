import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup
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

export const AddPortfolioModal = ({ open, handleClose }) => {
  const [portfolioType, setPortfolioType] = useState('spec');
  const handlePortfolioType = (event, newPortfolioType) => {
    setPortfolioType(newPortfolioType);
  };
  const [portfolioName, setPortfolioName] = useState('');

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid
                item
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography
                  color="textSecondary"
                  display="inline"
                  sx={{ pl: 1 }}
                  variant="h5"
                >
                  New Portfolio
                </Typography>
              </Grid>
            </Grid>
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

          <TextField
            sx={{ p:2  }}
            id="portfolio-name"
            label="Portfolio Name"
            placeholder="My Portfolio"
            variant="standard"
            fullWidth={true}
            onChange={(event) => setPortfolioName(() => event.target.value)}
           />

          <TextField
            disabled={portfolioType !== 'spec'}
            sx={{ p:2  }}
            id="speculative-money"
            label="Speculative Money"
            placeholder="1000"
            variant="standard"
            fullWidth={true}
           />
          
          {/* THE INFOBOX */}
          <Alert sx={{ visibility: 'hidden' }} severity="info">This is an info alert — check it out!</Alert>
   
          <Divider />
          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

              <Button onClick={() => console.log(portfolioName)} variant="outlined">Create</Button>

          </Box>
        </Box>
      </Card>
    </Modal>
  );
  
}

 