import * as React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import api from 'src/apis/api';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Facebook as FacebookIcon } from '../icons/facebook';
import { Google as GoogleIcon } from '../icons/google';
import { useCookies } from 'react-cookie';
import { ErrorSnackbar, severityObj, messageObj} from '../components/error-snackbar/error-snack';




const Login = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState(severityObj.OK);
  const formik = useFormik({
    initialValues: {
      email: 'email@email.com',
      password: 'Password123'
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required')
    }),
    onSubmit: async (values) => {







      var bodyFormData = new FormData();
      bodyFormData.append('email', values.email);
      bodyFormData.append('password', values.password);

      const loginData = {
        email: values.email,
        password: values.password
      }
      try {
      const response = await api.post('/login', loginData)

      if (response.data.status === 200) {
        setCookie('spector_jwt', response.data.spector_jwt);
        router.push('/')
      }


      if (response.data.status === 401) {
        setSeverity(severityObj.error);
        setMessage(messageObj.BAD_LOGIN);
        setOpen(true);
        return;
      }

      } catch(err) {
        setSeverity(severityObj.error);
        setMessage(messageObj.SERVER_UNREACHABLE);
        setOpen(true);
        return;
        console.log(err)
      }
    }
  });
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    if(cookies.spector_jwt) {
      router.push('/');
    }
  }, [])

  return (
    <>
      <Head>
        <title>Login | Spector Trades</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/home"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Home
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Sign in
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in on the internal platform
              </Typography>
            </Box>
            <Grid
              container
              spacing={3}
            >
            </Grid>
            <Box
              sx={{
                pb: 1,
                pt: 3
              }}
            >
              <Typography
                align="center"
                color="textSecondary"
                variant="body1"
              >
                Login with email address
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"

              placeholder="alex@example.com"
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
              <Button onClick={() => {


                api.post('/auth', {jwt_token: cookies.spector_jwt})

                }}>
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
      <ErrorSnackbar severity={severity} message={message} open={open} handleClose={handleSnackClose} />
    </>
  );
};

export default Login;
