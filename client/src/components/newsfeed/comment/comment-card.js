import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { Clock as ClockIcon } from "../../../icons/clock";

const style = {
  bgcolor: "background.paper",
};

export const CommentCard = () => (
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        tincidunt pulvinar congue.
      </CardContent>
    </Box>
  </Card>
);
