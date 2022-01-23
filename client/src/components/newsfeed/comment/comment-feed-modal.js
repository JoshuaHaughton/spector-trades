import { Box, Grid, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import api from "src/apis/api";

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



  // const fetchArticleId = async () => {
  //   console.log('stateeeee', parentState)
  //   let response = await api.get(`/comments/media/${parentState.type}/${parentState.id}`);

  //   const mediaId = response.data.data.media_id;

  //   console.log("MEDIA BACK!!!!!", mediaId)

  //   return mediaId;
  // };


  const fetchCommentArray = async () => {

    try {

      // let id = await fetchArticleId();
      let id = String(parentState.id)
      console.log('id', id)
      console.log('TYPE', parentState.type)

      let response = await api.get(`/comments/${parentState.type}/${id}`);

      console.log('COMMENT ARRAY RESPONSE', response.data.data.comments)
      console.log('CURRENT COMMENTS BEFORE SETTING', comments)

      //Check if response is an array
      if (Array.isArray(response.data.data.comments) && response.data.data.comments.length > 0) {
        setComments(response.data.data.comments.reverse());
      }

    } catch(err) {
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
