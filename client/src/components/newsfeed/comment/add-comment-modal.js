import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "src/apis/api";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "1px solid #555",
  boxShadow: 24,
  borderRadius: "8px",
};

export const AddCommentModal = ({ open, handleClose, parentPost }) => {
  const [cookies, setCookie] = useCookies();
  const [charLeft, setCharLeft] = useState(140);
  const [charColour, setCharColour] = useState('textSecondary')

  const formik = useFormik({
    initialValues: {
      body: "",
    },
    validationSchema: Yup.object({
      body: Yup.string().max(140).required("Your post can't be empty!"),
    }),
    onSubmit: async (values) => {
      console.log(values);

      //set as falsey
      let savedArticle = false;

      try {

        //check if article exists / retrieve article
        let articles = await api.get(`/articles/${parentPost._id}`)


        //article exist check
        if (Object.keys(articles.data.data).length > 0) {

           // //retrieve article to post
          savedArticle = articles.data.data.article;
          console.log("ARTICLE RETRIEVED", savedArticle)
        } else {

          console.log("article isn't being saved to database, so you can't comment")
          console.log("attempting to create article")

          //attempt to create new article if article doesn't already exist (shouldve been created upong api request, but if for some reason it wasn't, it creates it here)
          if (!savedArticle) {
            await api.post("/articles", parentPost)
            .then((resp) => {
              console.log("ARTICLE CREATION", resp.data.data.article[0])

              savedArticle = resp.data.data.article[0];
            })
          }

        }


        const formData = {
          body: values.body,
          article_id: savedArticle.id
        };


        //Post comment and link it to article, then close modal
        await api({
            method: "post",
            url: "/comments/article",
            data: formData,
            headers: {
              "Content-Type": "application/json",
              "Authorization": cookies.spector_jwt
            },
          }).then(resp => {
            if(resp.data.status === 200) {
              handleClose();
            }
          })

      } catch (err) {
        console.log(err);

      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
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
                  <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                    You
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <TextField sx={{ p: 2 }} fullWidth={true} name="body" onChange={(e) => {
              formik.handleChange(e);
              setCharLeft(140 - e.target.value.length);
              ((140 - e.target.value.length < 0) ? setCharColour('red') : setCharColour('textSecondary'))
            }} />
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
                  <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                    <Button variant="outlined" type="submit">
                      Post Comment
                    </Button>
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Typography color={charColour} display="inline" sx={{ pl: 1 }} variant="body2">
                    {charLeft}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </Card>
    </Modal>
  );
};
