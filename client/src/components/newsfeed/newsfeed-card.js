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
import api from "src/apis/api";

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
  const [cookies, setCookie] = useCookies();
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState("Loading");


  const createArticle = async () => {

    try {

      console.log("going to create article now...");
      let articles = await api.get(`/articles/${article._id}`);


      console.log("grabbed this article for exist check", articles.data.data.article);

      //exist check
      if (Object.keys(articles.data.data).length > 0) {
        //save retrieved article
        const savedArticle = articles.data.data.article;
        console.log("ARTICLE EXISTS", savedArticle);

      } else {
        //create article
        await api({
          method: "post",
          url: "/articles",
          data: article,
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.spector_jwt,
          },
        }).then((resp) => {
          console.log(resp);

        });
      }

    } catch (err) {}

  };


  const checkIfLiked = async () => {

    try {

      await api({
        method: "get",
        url: `/likes/${article._id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.spector_jwt}`,
        },
      }).then((resp) => {

        console.log("CHECK IF LIKED FRONTEND", resp.data.data.exists);
        setLiked(resp.data.data.exists);

      });

      return response;

    } catch (err) {}

  };

  const fetchTotalLikes = async () => {

    try {

      await api({
        method: "get",
        url: `/likes//count/${article._id}`,
      }).then((resp) => {

        console.log("LIKE COUNT FRONTEND", resp.data.data.count);
        setTotalLikes(resp.data.data.count);

      });

    } catch (err) {}

  };


  const pressLike = () => {
    if (liked) {
      setLiked(false);
      setBackendLike();
      setTotalLikes(totalLikes - 1);
    } else {
      setLiked(true);
      setBackendLike();
      setTotalLikes(totalLikes + 1);
    }
  };

  const setBackendLike = async () => {

    try {

      await api({
        method: "post",
        url: `/likes/${article._id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.spector_jwt}`,
        },
      }).then((resp) => {
        console.log("(frontend)LIKE: ", resp.data.data.like);
      });

    } catch (err) {

      console.log(err);
      console.log("setting backend like failed");

    }
  };



  //ON FIRST MOUNT ONLY
  useEffect(() => {
    createArticle();
    checkIfLiked();
    fetchTotalLikes();
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
            <Avatar alt="Article Image" src={article.media} variant="rounded" />
            <Typography color="textSecondary" display="inline" sx={{ pl: 1, fontSize: "16px" }} variant="body2">
              {/* displays author, or clean_url if author isnt there (e.g. google.com) */}
              <strong>{article.author || article.clean_url}</strong> -{" "}
              {article.title.length > 67 ? article.title.substring(0, 67) + "..." : article.title}
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
              <TimeAgo datetime={article.published_date} locale="en" />
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
        <Typography align="center" color="textPrimary" variant="body1" sx={{fontSize: '14px' }}>
          {article.summary.length > 150
            ? article.summary.substring(0, 150) + "..."
            : article.summary}
          <br />
          <br />
          <Link href={article.link} color="inherit">
            Click here to learn more
          </Link>
        </Typography>
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
              <Button onClick={pressLike} >
              {liked ? <FavoriteIcon sx={{ fontSize: "35px", color: "red" }} /> : <FavoriteBorderIcon sx={{ fontSize: "35px" }}/>}
              </Button>
              <CommentFeedModal
                open={commentFeedOpen}
                handleClose={handleCommentFeedClose}
                article={article}
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
                //PASSES ARTICLE TO ADD COMMENT MODAL
                parentPost={article}
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
                article={article}
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
