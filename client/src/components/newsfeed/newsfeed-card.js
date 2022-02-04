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
  Link,
} from "@mui/material";
import { AddCommentModal } from "../../components/newsfeed/comment/add-comment-modal";
import { CommentFeedModal } from "../../components/newsfeed/comment/comment-feed-modal";
import { useState, useEffect } from "react";
import { Clock as ClockIcon } from "../../icons/clock";
import TimeAgo from "timeago-react";
import { useCookies } from "react-cookie";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { fetchTotalLikes, pressLike, setBackendLike, checkIfLiked, createArticle } from "../helpers/newsfeed-card-helper";
import { userSetter } from "../helpers/user-helper";


export const NewsfeedCard = ({ media, ...rest }) => {
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const handleAddCommentOpen = () => setAddCommentOpen(true);
  const handleAddCommentClose = () => setAddCommentOpen(false);
  const [commentFeedOpen, setCommentFeedOpen] = useState(false);
  const handleCommentFeedOpen = () => setCommentFeedOpen(true);
  const handleCommentFeedClose = () => setCommentFeedOpen(false);
  const [cookies, setCookie] = useCookies();
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [state, setState] = useState(() => {

    //First conditional sets up variables so that regardless of the name of the variables
    // they come in, they can be processed by the newsfeed card

    //Articles here have an id key of "_id"
    if (media.title && !media.id) {
      console.log('ARTICLE', media)

      return {

        mediaTitle: media.title.length > 55 ? media.title.substring(0, 55) + "..." : media.title,
        mediaPublish: media.publishedAt,
        mediaBody: media.description.length > 150 ? media.description.substring(0, 150) + "..." : media.description,
        id: media.title.split(" ").join("").split("%").join("").split(`’`).join("").split(`'`).join("").split(",").join("").split(".").join(""),
        media,
        type: `original_article_title`
      }

    //Posts here have an id key of "id"
  } else if (media.id && !media.title) {

    return {
      mediaPublish: media.created_at,
      mediaBody: media.description,
      id: media.id,
      media,
      type: `post_id`,
      username: media.username,
      profileSrc: 'http://localhost:3001/public/avatars/' + media.avatar_url
    }
  }

})


  //ON FIRST MOUNT ONLY
  useEffect(() => {

    if (media.title && !media.id) {

      console.log('JBO GON TRY TO CREATE ARTICLE', state)


        createArticle(state, cookies);
        checkIfLiked(state, cookies, setLiked);
        fetchTotalLikes(state, cookies, setTotalLikes);

    } else if (media.id && !media.title) {

        checkIfLiked(state, cookies, setLiked);
        fetchTotalLikes(state, cookies, setTotalLikes);
        userSetter(state, setState, cookies);

    }

  }, []);


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
            { ( media.avatar_url ? <Avatar alt={media.username} src={'http://localhost:3001/public/avatars/' + media.avatar_url } variant="rounded" />
            : <Avatar alt="Article Image" src={media.urlToImage} variant="rounded" /> ) }
            <Typography color="textSecondary" display="inline" sx={{ pl: 1, fontSize: "14px" }} variant="body2">
              {/* displays author, or clean_url if author isnt there (e.g. google.com), and for posts it displays the username */}
              <strong>{media.title ? (media.author || media.source.name) :`- @${media.username}`}</strong>{" "}
              {state.mediaTitle}
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
            <Typography color="textSecondary" display="inline" sx={{ pl: 1, fontSize: "16px" }} variant="body2">
              <TimeAgo datetime={state.mediaPublish} locale="en" />
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
        {media._id ?
          <Typography align="center" color="textPrimary" variant="body1" sx={{fontSize: '14px' }}>
          {state.mediaBody}
          <br />
          <br />
          {media._id &&
          <Link href={media.link} target="_blank" color="inherit">
            Click here to learn more
          </Link>
          }
        </Typography> :

        <Typography align="center" color="textPrimary" variant="body1" sx={{fontSize: '16px' }}>
        {state.mediaBody}
        {/* <br />
        <br /> */}
      </Typography>
        }
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 1, display: "flex", justifyContent: "space-between" }}>
        <Grid container sx={{ justifyContent: "flex-start", width: "50%" }}>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
              <Button onClick={() => pressLike(liked, setLiked, totalLikes, setBackendLike, setTotalLikes, state, cookies)} >
              {liked ? <FavoriteIcon sx={{ fontSize: "35px", color: "red" }} /> : <FavoriteBorderIcon sx={{ fontSize: "35px" }}/>}
              </Button>
              <CommentFeedModal
                open={commentFeedOpen}
                handleClose={handleCommentFeedClose}
                media={state.media}
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
            <Typography color="textSecondary" display="inline" sx={{ fontSize: "22px" }} variant="body2">
              {totalLikes != 1 ?  `${totalLikes} likes` : `1 like`}
              <AddCommentModal
                open={addCommentOpen}
                handleClose={handleAddCommentClose}
                //PASSES media TO ADD COMMENT MODAL
                parentPost={media}
              />
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ justifyContent: "flex-end", width: "50%" }}>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
              <Button onClick={handleCommentFeedOpen} variant="text" sx={{fontSize: '16px' }}>
                All comments
              </Button>
              <CommentFeedModal
                open={commentFeedOpen}
                handleClose={handleCommentFeedClose}
                media={state.media}
                parentState={state}
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
            <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
              <Button onClick={handleAddCommentOpen} variant="text" sx={{fontSize: '16px' }}>
                Add comment
              </Button>
              <AddCommentModal
                open={addCommentOpen}
                handleClose={handleAddCommentClose}
                //PASSES ARTICLE TO ADD COMMENT MODAL
                parentPost={media}
                parentState={state}
              />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

};

//article /post is required
NewsfeedCard.propTypes = {
  media: PropTypes.object.isRequired,
};
