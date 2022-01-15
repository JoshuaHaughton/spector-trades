import Head from 'next/head';
import NextLink from 'next/link';
import api from 'src/apis/api';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Input,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Register = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      avatar: {},
      // policy: false
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      username: Yup
        .string()
        .max(255)
        .required(
          'Username is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required'),
      avatar: Yup
        .mixed(),
      //   .test(
      //   "fileSize",
      //   "File is too large",
      //   value => !value || (value && value.size <= FILE_SIZE)
      //   )
      //   .test(
      //   "fileFormat",
      //   "Unsupported Format",
      //   value => !value || (value => value && SUPPORTED_FORMATS.includes(value.type))
      // ),
      policy: Yup
        .boolean()
        .oneOf(
          [true],
          'This field must be checked'
        )
    }),
    onSubmit: async (values) => {
      console.log(values)
   
      const config = {     
        headers: { 'Content-Type': 'multipart/form-data' }

    }
    

      // const response = await api.post("/register", {
      //   username: values.username,
      //   email: values.email,
      //   password: values.password,
      //   avatar: values.avatar


      // })
      const response = await api({
        url: '/register',
        method: 'POST',
        Headers: {
          "content-type": "multipart/form-data",
        },
        data: values.avatar,
        params: {
          username: values.username, 
          email: values.email, 
          password: values.password
        }
      });
      console.log(response)
      // router.push('/');
    }
  });

  return (
    <>
      <Head>
        <title>
          Register | Material Kit
        </title>
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
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Dashboard
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Create a new account
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Use your email to create a new account
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="Userame"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.username}
              variant="outlined"
            />
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
              value={formik.values.email}
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
              value={formik.values.password}
              variant="outlined"
            />
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* <Button
                  variant="contained"
                  component="label"
                  name="avatar"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                  />
                </Button> */}
              {/* <label htmlFor="contained-button-file">
                <Input id="contained-button-file" type="file" name="avatar" onChange={formik.handleChange}/>
              </label> */}
              <input id="file" name="avatar" type="file" onChange={(event) => {
                formik.setFieldValue("avatar", event.currentTarget.files[0]);
              }} />
              {/* <input id="file" name="avatar" type="file" onChange={formik.handleChange} /> */}

            </Stack>
            {/* <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1
              }}
            >
              <Checkbox
                checked={formik.values.policy}
                name="policy"
                onChange={formik.handleChange}
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                I have read the
                {' '}
                <NextLink
                  href="#"
                  passHref
                >
                  <Link
                    color="primary"
                    underline="always"
                    variant="subtitle2"
                  >
                    Terms and Conditions
                  </Link>
                </NextLink>
              </Typography>
            </Box> */}
            {/* {Boolean(formik.touched.policy && formik.errors.policy) && (
              <FormHelperText error>
                {formik.errors.policy}
              </FormHelperText> */}
            {/* )} */}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign Up Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Have an account?
              {' '}
              <NextLink
                href="/login"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
