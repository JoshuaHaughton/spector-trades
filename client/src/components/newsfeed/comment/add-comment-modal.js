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
  console.log('cookah', cookies)

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
        // let bodyFormData = new FormData();
        // bodyFormData.append("form-body", values.body);

        let resp = await api.post("/articles", parentPost);

        const savedArticle = resp.data.data.article[0];
        console.log(savedArticle)

        // bodyFormData.append("article-id", savedArticle.id);

        const formData = {
          body: values.body,
          article_id: savedArticle.id
        };

        console.log(formData)

        // let cookieResp = await api.post("/comments/", formData);
        api({
            method: "post",
            url: "/comments/article",
            data: formData,
            headers: {
              "Content-Type": "application/json",
              "Authorization": cookies.spector_jwt
            },
          })

          /*
curl -X POST http://localhost:3001/api/comments -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ1c2VyX2VtYWlsIjoiZWF0ZGVtQGNvb2tpZXMuY29tIiwiaWF0IjoxNjQyNTI5NTAyfQ.I4wkKqnv9fuPCxHob8dIwOrrlzF-F_FLvT2r5bTtROs" -H "Content-Type: application/json" --data-binary @- <<DATA
{"post_id":"1",
"body":"I LIKE COOOKIES"}
DATA
*/

        // console.log(cookieResp);

      } catch (err) {
        console.log(err);

      }

      // return resp

      // bodyFormData.append('article-id', response.id);

      // console.log('response', response)

      // const formData = {
      //   body: values.body,
      //   articleId: response.id
      // }

      // try {

      // //CREATING NEW ARTICLE IN DB FROM PARENT POST (THIS ARTICLE)

      // await api.post("/comments", formData)

      // console.log('formdata', formData)

      // } catch(err) {
      //   console.log(err)

      // }

      // api({
      //   method: "post",
      //   url: "/comments",
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // })
      //   .then(function (response) {
      //     const respData = response.data;
      //   });
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
            <TextField sx={{ p: 2 }} fullWidth={true} name="body" onChange={formik.handleChange} />
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
                  <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                    140
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
