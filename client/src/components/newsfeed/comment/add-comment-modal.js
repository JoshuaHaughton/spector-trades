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
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';


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


  const formik = useFormik({
    initialValues: {
      body: ''
    },
    validationSchema: Yup.object({
      body: Yup
        .string()
        .max(140)
        .required(
          "Your post can't be empty!")
    }),
    onSubmit: async (values) => {



      console.log(values)




      var bodyFormData = new FormData();
      bodyFormData.append('form-body', values.body);
      bodyFormData.append('jwt', cookies.jwt_token);
      // bodyFormData.append('user_id', values.password);

      //CREATING NEW ARTICLE IN DB FROM PARENT POST (THIS ARTICLE)
      api({
        method: "post",
        url: "/articles",
        data: parentPost,
        headers: { "Content-Type": "multipart/form-data" },
      })

      api({
        method: "post",
        url: "/comments",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          const respData = response.data;
        });

      }

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
              <Typography
                color="textSecondary"
                display="inline"
                sx={{ pl: 1 }}
                variant="body2"
              >
                You
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <TextField sx={{ p: 2 }} fullWidth={true} />
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
              <form onSubmit={formik.handleSubmit}>
              <Typography
                color="textSecondary"
                display="inline"
                sx={{ pl: 1 }}
                variant="body2"
              >
                <Button
                variant="outlined"
                onClick={() => {

                  console.log(cookies)

                  api.post('/auth', {jwt_token: cookies.spector_jwt})

                  }}
                  >Post Comment</Button>
              </Typography>
              </form>
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
                123
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  </Modal>
  )};
