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
  Link
} from "@mui/material";
import { AddCommentModal } from "../../components/newsfeed/comment/add-comment-modal";
import { CommentFeedModal } from "../../components/newsfeed/comment/comment-feed-modal";
import { useState } from "react";
import { Clock as ClockIcon } from "../../icons/clock";
import TimeAgo from 'timeago-react';

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

export const NewsfeedCard = ({ article, ...rest }) => {
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const handleAddCommentOpen = () => setAddCommentOpen(true);
  const handleAddCommentClose = () => setAddCommentOpen(false);
  const [commentFeedOpen, setCommentFeedOpen] = useState(false);
  const handleCommentFeedOpen = () => setCommentFeedOpen(true);
  const handleCommentFeedClose = () => setCommentFeedOpen(false);


  console.log(Date.parse(article.published_date))
75

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
            <Avatar alt="Article Image" src={article.media} variant="rounded" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              <strong>{article.author || article.clean_url}</strong> - {
                article.title.length > 100 ? article.title.substring(0, 100) + '...' : article.title
              }
              {/* displays author, or clean_url if author isnt there (e.g. google.com) */}
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
              {/* 2 days ago */}
              <TimeAgo datetime={article.published_date} locale='en'/>
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
          {
            article.summary.length > 150 ? article.summary.substring(0, 150) + '...' : article.summary
          }
          <br/>
          <br/>
          {/* <a href={article.link}>Click here to learn more</a> */}
          <Link href={article.link} color="inherit">
            Click here to learn more
          </Link>
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
              <Button onClick={handleCommentFeedOpen} variant="text">
                All comments
              </Button>
              <CommentFeedModal
                open={commentFeedOpen}
                handleClose={handleCommentFeedClose}
              />
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
              <Button onClick={handleAddCommentOpen} variant="text">
                Add comment
              </Button>
              <AddCommentModal
                open={addCommentOpen}
                handleClose={handleAddCommentClose}
                //PASSES ARTICLE TO ADD COMMENT MODAL
                parentPost={article}
              />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

NewsfeedCard.propTypes = {
  article: PropTypes.object.isRequired,
};
