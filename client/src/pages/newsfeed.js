import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { newsfeedPosts } from '../__mocks__/newsfeedposts';
import { NewsfeedListToolbar } from '../components/newsfeed/newsfeed-list-toolbar';
import { NewsfeedCard } from '../components/newsfeed/newsfeed-card';
import { DashboardLayout } from '../components/dashboard-layout';

const Newsfeed = () => (
  <>
    <Head>
      <title>
        Newsfeed | Spector Trades
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <NewsfeedListToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {newsfeedPosts.map((product) => (
              <Grid
                item
                key={product.id}
                lg={12}
                md={12}
                xs={12}
              >
                <NewsfeedCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Box>
  </>
);

Newsfeed.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Newsfeed;
