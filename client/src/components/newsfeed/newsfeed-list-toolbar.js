import {
    Box,
    Button,
    Typography
  } from '@mui/material';
import { useState } from 'react';
  import { AddPostModal } from './post/add-post-modal';

  export const NewsfeedListToolbar = ({ triggerReload, ...rest }) => {

    const [addPostOpen, setAddPostOpen] = useState(false);
    const handleAddPostOpen = () => setAddPostOpen(true);
    const handleAddPostClose = () => setAddPostOpen(false);


  return (
    <Box {...rest}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          My feed
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleAddPostOpen}
          >
            Add post
          </Button>
          <AddPostModal
                open={addPostOpen}
                handleClose={handleAddPostClose}
                triggerReload={triggerReload}
                //PASSES ARTICLE TO ADD Post MODAL
              />
        </Box>
      </Box>
    </Box>
  )};
