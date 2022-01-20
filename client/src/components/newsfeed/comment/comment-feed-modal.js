import { Box, Grid, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import api from "src/apis/api";

import { CommentCard } from "./comment-card";

const style = {
  width: "100%",
  maxWidth: 600,
};

export const CommentFeedModal = ({ open, handleClose, article }) => {
  const [comments, setComments] = useState([
    {
      id: 0,
      user_id: 0,
      post_id: 0,
      article_id: 0,
      body: "No comments to show",
    },
  ]);

  // console.log("OLD ID", article._id);
  const originalId = article._id;

  const fetchArticleId = async () => {
    let response = await api.get(`/comments/article/${originalId}`);

    const articleId = response.data.data.article_id;

    return articleId;
  };


  const fetchCommentArray = async () => {
    let id = await fetchArticleId();

    let response = await api.get(`/comments/article_id/${id}`);

    //Check if response is an array
    if (Array.isArray(response.data.data.comments)) {
      setComments(response.data.data.comments);
    }

  };

  //Fetches comments everytime the comment modal opens (updating as you post comments)
  useEffect(() => {
    fetchCommentArray();
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
            <Grid item key={comment.id} lg={12} md={12} xs={12}>
              <CommentCard comment={comment} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
};
