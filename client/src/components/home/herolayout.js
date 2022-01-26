import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Container, IconButton } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Link } from 'react-scroll';


const HeroLayoutRoot = styled('section')(({ theme }) => ({
  color: theme.palette.common.white,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'space-between',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
    height: 'calc(100vh - 64px)',
    minHeight: 500,
    maxHeight: 1300,
  },
}));

const Background = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  zIndex: -2,
});

function HeroLayout(props) {
  const { sxBackground, children } = props;

  return (
    <HeroLayoutRoot
    id="top"
      // sx={{width: 100vw}}
    >
      <Container maxWidth='xl'
        sx={{
          mt: 3,
          mb: 14,
          // maxWidth: '100vw',
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {children}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: '#514BB8',
            opacity: 1,
            zIndex: -1,
          }}
        />
        <Background sx={sxBackground} />
        <Box
          alt="arrow down"
          sx={{ position: 'absolute', bottom: 32 }}
        >
          <Link to="features" spy={true} smooth={true} duration={1000}>
            <IconButton size="large" sx={{color: 'white', transition: "all 300ms ease", scrollBehavior: "smooth"}}>
              <DoubleArrowIcon sx={{
                transform: 'rotate(90deg)',
                fontSize: '40px',
                }}
                />
            </IconButton>
          </Link>
        </Box>
      </Container>
    </HeroLayoutRoot>
  );
}

HeroLayout.propTypes = {
  children: PropTypes.node,
  sxBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default HeroLayout;
