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
import { useState, useEffect, useLayoutEffect } from "react";
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

export const NewsfeedCard = ({ media, ...rest }) => {
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const handleAddCommentOpen = () => setAddCommentOpen(true);
  const handleAddCommentClose = () => setAddCommentOpen(false);
  const [commentFeedOpen, setCommentFeedOpen] = useState(false);
  const handleCommentFeedOpen = () => setCommentFeedOpen(true);
  const handleCommentFeedClose = () => setCommentFeedOpen(false);
  const [cookies, setCookie] = useCookies();
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState("Loading");
  const [state, setState] = useState(() => {

    if (media._id && !media.id) {
      console.log('ARTICLE', media)



      return {

        mediaTitle: media.title.length > 55 ? media.title.substring(0, 55) + "..." : media.title,
        mediaPublish: media.published_date,
        mediaBody: media.summary.length > 150 ? media.summary.substring(0, 150) + "..." : media.summary,
        id: media._id,
        media,
        type: `original_article_id`
      }



  } else if (media.id && !media._id) {
    console.log('POST', media)
    return {
      mediaPublish: media.created_at,
      mediaBody: media.description,
      id: media.id,
      media,
      type: `post_id`,
      username: media.username,
      profileSrc: ''
    }
  }

})




  const createArticle = async () => {

    try {

      console.log("going to create article now...");

      // let articles = await api.get(`/articles/`);



      console.log('STATE FFS', state)
      let media = await api({
        method: "get",
        url: `/articles/${state.type}/${state.id}`,
        data: state,
        headers: {
          "Content-Type": "application/json",
          Authorization: cookies.spector_jwt,
        },
      })


      console.log("grabbed this article for exist check", media.data.data);

      //exist check
      if (Object.keys(media.data.data).length > 0) {
        //save retrieved article
        const savedArticle = media.data.data.article;
        console.log("ARTICLE EXISTS", savedArticle);

      } else {
        //create article
        await api({
          method: "post",
          url: "/articles",
          data: media,
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.spector_jwt,
          },
        }).then((resp) => {
          console.log('creation response check', resp);

        });
      }

    } catch (err) {}

  };

  // let mediaTitle = '';
  // let mediaPublish;
  // let mediaBody;

  // if (article && !post) {
  //   mediaTitle = article.title.length > 60 ? article.title.substring(0, 60) + "..." : article.title
  //   mediaPublish = article.published_date
  //   mediaBody = article.summary.length > 150
  //           ? article.summary.substring(0, 150) + "..."
  //           : article.summary;
  // } else if (post && !article) {
  //   mediaPublish = post.created_at;
  //   mediaBody = post.description;
  // }






  const fetchUser = async () => {
    const userReturned = await api({
      method: "get",
      url: "/users/id/me",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`
      }
    })
    console.log("Fetch user", userReturned.data.data.user)
    return userReturned.data.data.user;
  }





  // let id;
  // let media;

  // if (article && !post) {
  //   id = article._id
  //   media = article




  // } else if (post && !article) {
  //   id = post.id
  //   media = post

  // }

  // if (article && !post) {



  const checkIfLiked = async () => {

    try {

      await api({
        method: "put",
        url: `/likes/${state.id}`,
        data: state.media,
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
      console.log('STATE FOR COUNT', state.media)

      await api({
        method: "get",
        url: `/likes/count/${state.type}/${state.id}`,
        data: state.media,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.spector_jwt}`,
        }
      }).then((resp) => {

        console.log("LIKE COUNT FRONTEND", resp.data.data.count);
        setTotalLikes(Number(resp.data.data.count));

      });

    } catch (err) {}

  };



  const setBackendLike = async () => {

    try {

      await api({
        method: "post",
        url: `/likes/${state.id}`,
        data: state.media,
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

  const pressLike = () => {
    if (liked) {
      setLiked(false);
      setBackendLike();
      setTotalLikes(Number(totalLikes) - 1);
    } else {
      setLiked(true);
      setBackendLike();
      setTotalLikes(Number(totalLikes) + 1);
    }
  };


  const asyncArticleLink = async () => {
    try {

    } catch(err) {

    }
  }

  const userSetter = async () => {
    try {
      await fetchUser()
      .then(data => {
        data.avatar_url ? setState({...state, profileSrc: data.avatar_url}) : console.log("no profile pic")
      })
      // console.log(userResponse)
      (fetchUser());
      console.log('USER', user)

    } catch(err) {
      console.log(err)
    }

  }

//   useLayoutEffect(() => {

//   if (media._id && !media.id) {
//     console.log('ARTICLE', media)

//       createArticle();
//       checkIfLiked();
//       fetchTotalLikes();

// } else if (media.id && !media._id) {
//   console.log('POST', media)

//       checkIfLiked();
//       fetchTotalLikes();
//       (fetchUser());

// })


  //ON FIRST MOUNT ONLY
  useEffect(() => {

    console.log("FETCHINNNNN", fetchUser())

    if (media._id && !media.id) {
      // setState({

      //   mediaTitle: article.title.length > 60 ? article.title.substring(0, 60) + "..." : article.title,
      //   mediaPublish: article.published_date,
      //   mediaBody: article.summary.length > 150 ? article.summary.substring(0, 150) + "..." : article.summary,
      //   id: article._id,
      //   media: article

      // })
        createArticle();
        checkIfLiked();
        fetchTotalLikes();





    } else if (media.id && !media._id) {
      // setState({

      //   mediaPublish: post.created_at,
      //   mediaBody: post.description,
      //   id: post.id,
      //   media: post

      // })

        checkIfLiked();
        fetchTotalLikes();

        userSetter();
        // setState({...state, profileSrc = })




    }

    // if (article) createArticle();
    // checkIfLiked();
    // fetchTotalLikes();
    // fetchUserPosts();
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
            <Avatar alt="Article Image" src={state.media.media || state.profileSrc} variant="rounded" />
            <Typography color="textSecondary" display="inline" sx={{ pl: 1, fontSize: "14px" }} variant="body2">
              {/* displays author, or clean_url if author isnt there (e.g. google.com) */}
              <strong>{media._id ? (media.author || media.clean_url) :`- @${media.username}`}</strong>{" "}
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
          <Link href={media.link} color="inherit">
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
              <Button onClick={pressLike} >
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

// } else if (post && !article) {
//   console.log("POST CAME IN", post)


// }

};

NewsfeedCard.propTypes = {
  media: PropTypes.object.isRequired,
};
