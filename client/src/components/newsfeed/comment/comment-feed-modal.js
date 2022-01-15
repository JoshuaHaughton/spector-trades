import { Box, Grid, Dialog } from "@mui/material";

import { CommentCard } from "./comment-card";

const style = {
  width: "100%",
  maxWidth: 600,
};

export const CommentFeedModal = ({ open, handleClose }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    scroll={"body"}
  >
    <Box sx={style}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((comment) => (
          <Grid item key={comment} lg={12} md={12} xs={12}>
            <CommentCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Dialog>
);
