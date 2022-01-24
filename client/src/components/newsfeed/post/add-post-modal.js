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

export const AddPostModal = ({ open, handleClose, triggerReload }) => {
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


      try {

        const fetchUserName = await api({
          method: "get",
          url: `/users/id/me`,
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.spector_jwt,
          },
        })


        let username = fetchUserName.data.data.user.username


        let formData = {
            body: values.body,
            username
          }

          console.log('TIME TO POST')


        //Post the Post, then close modal
        await api({
            method: "post",
            url: "/posts",
            data: formData,
            headers: {
              "Content-Type": "application/json",
              "Authorization": cookies.spector_jwt
            },
          }).then(resp => {
            console.log(resp.data)
            if(resp.data.status === 200 || resp.data.status === 304) {
              handleClose();
              triggerReload();
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
            <TextField sx={{ p: 4 }} fullWidth={true} name="body" onChange={(e) => {
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