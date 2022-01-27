import styled from '@emotion/styled'
import { AppBar, Box, Toolbar, IconButton, Typography, Link} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const HomeNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  color: theme.palette.common.black,
}));

export const HomeNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;

  return (
    <>
      <HomeNavbarRoot
        id="top"
        sx={{  position: 'relative', height: 80 }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            height: 80,
            left: 0,
            px: 2
          }}
        >
          {/* <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton> */}


            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
              <Box sx={{marginLeft: 8}}>
              <img
                    src="/static/images/Spector-Trades-logo-4.svg"
                    alt="Spector Trades"
                    height="50px"

                  />

              </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mr: 10}}>
                    <Link href="/" underline="none" sx={{ marginLeft: '32px', fontWeight: 'bold'}}>
                      Dashboard
                    </Link>
                    <Link href="/newsfeed" underline="none" sx={{ marginLeft: '32px', fontWeight: 'bold'}}>
                      Newsfeed
                    </Link>
                    <Link href="/login" underline="none" sx={{ marginLeft: '32px', fontWeight: 'bold'}}>
                      Login
                    </Link>
                  </Box>
            </Box>

          { /*
          <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
              <UsersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              ml: 1
            }}
            src="/static/images/avatars/avatar_1.png"
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>

          */}
        </Toolbar>

      </HomeNavbarRoot>
    </>
  );
};
