import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { AddCommentModal } from "../../components/newsfeed/comment/add-comment-modal";
import { useState } from "react";
import { Clock as ClockIcon } from "../../icons/clock";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const NewsfeedCard = ({ product, ...rest }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      {...rest}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Avatar alt="Product" src={product.media} variant="square" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {product.title}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <ClockIcon color="action" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              2 days ago
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        ></Box>
        <Typography align="center" color="textPrimary" variant="body1">
          {product.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
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
              <Button variant="text">All comments</Button>
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
              <Button onClick={handleOpen} variant="text">
                Add comment
              </Button>
              <AddCommentModal open={open} handleClose={handleClose} />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

NewsfeedCard.propTypes = {
  product: PropTypes.object.isRequired,
};
