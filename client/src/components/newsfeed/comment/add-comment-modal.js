import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  Modal,
  TextField,
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

export const AddCommentModal = ({ open, handleClose }) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={style}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
            <Grid
              item
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <Avatar alt="Product" variant="square" />
              <Typography
                color="textSecondary"
                display="inline"
                sx={{ pl: 1 }}
                variant="body2"
              >
                Author Name
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <TextField sx={{ p: 2 }} fullWidth={true} />
        <Divider />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
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
                variant="body2"
              >
                <Button variant="outlined">Post Comment</Button>
              </Typography>
            </Grid>
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
                variant="body2"
              >
                123
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  </Modal>
);
