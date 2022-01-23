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

export const AddCommentModal = ({ open, handleClose, parentPost, parentState }) => {
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
      console.log('parent', parentState)

      //set as falsey
      let savedMedia = false;

      try {

        //check if media exists / retrieve media
        let media = await api({
          method: "get",
          url: `/media/${parentState.type}/${parentState.id}`,
          data: parentState.media,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.spector_jwt}`,
          },
        })

        console.log('MEDIA EXISTS?', media.data.data.media)

        //media exist check
        if (Object.keys(media.data.data).length > 0) {

           //save media to original variable to post
          savedMedia = media.data.data.media;
          console.log("MEDIA RETRIEVED", savedMedia)
        }



        let formData;
        if(savedMedia.original_id) {
          formData = {
            body: values.body,
            media_id: savedMedia.original_id,
            ...parentState
          };
        } else {

          formData = {
            body: values.body,
            media_id: savedMedia.id,
            ...parentState
          };

        }


        //Post comment and link it to media, then close modal
        await api({
            method: "post",
            url: "/comments/media",
            data: formData,
            headers: {
              "Content-Type": "application/json",
              "Authorization": cookies.spector_jwt
            },
          }).then(resp => {

            if(resp.data.status === 200 || resp.data.status === 304) {
              handleClose();
              setCharLeft(140);
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
      onClose={() => {
        setCharLeft(140);
        handleClose();
      }}
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
