import styled from '@emotion/styled'
import { AppBar, Box, Toolbar, IconButton, Typography} from '@mui/material';
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
        sx={{  position: 'relative',     }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>


            <Box sx={{display: 'flex', width: '100%', justifyContent: 'center'}}>
              <img
                    src="/static/images/spector-trades-logo-3-cropped.svg"
                    alt="Spector Trades"
                    height="50px"
                  />
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