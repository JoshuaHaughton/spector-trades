import { Box, Grid, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchCommentArray } from "src/components/helpers/comment-feed-helpers";
import { CommentCard } from "./comment-card";

const style = {
  width: "100%",
  maxWidth: 600,
};

export const CommentFeedModal = ({ open, handleClose, media, parentState }) => {

  //Default response if no comment array for a specific media comes back
  const [comments, setComments] = useState([
    {
      id: 0,
      user_id: 0,
      post_id: 0,
      article_id: 0,
      body: "No comments to show",
      created_at: ""
    },
  ]);


  //Fetches comments everytime the comment modal opens (updating as you go to check comments)
  useEffect(() => {
    fetchCommentArray(parentState, comments, setComments);
  }, [open]);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      scroll={"body"}
    >
      <Box sx={style}>
        <Grid container spacing={3}>
          {comments.map((comment) => (
            // <Grid item key={comment.id} lg={12} md={12} xs={12}>
            <Grid item key={comment.id} lg={12} md={12} xs={12}>
              <CommentCard key={comment.id} comment={comment} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
};
