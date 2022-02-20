import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  IconButton,
  Typography,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const HomeNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  color: theme.palette.common.black,
}));

export const HomeNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const [drawerState, setDrawerState] = useState(false);

  const toggleDrawer = (open) => {
    setDrawerState(open);
  };

  const handleNavItemClick = (link) => {};

  const MenuList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        <ListItem button>
          <Link
            href="/"
            underline="none"
            sx={{ fontWeight: "bold", width: "100%" }}
          >
            Dashboard
          </Link>
        </ListItem>
        <ListItem button>
          <Link
            href="/newsfeed"
            underline="none"
            sx={{ fontWeight: "bold", width: "100%" }}
          >
            Newsfeed
          </Link>
        </ListItem>
        <ListItem button>
          <Link
            href="/login"
            underline="none"
            sx={{ fontWeight: "bold", width: "100%" }}
          >
            Login
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={drawerState}
        onClose={() => toggleDrawer(false)}
      >
        <MenuList />
      </Drawer>

      <HomeNavbarRoot
        id="top"
        sx={{ position: "relative", height: 80 }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            height: 80,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={() => toggleDrawer(true)}
            sx={{
              display: {
                xs: "inline-flex",
                sm: "none",
              },
              position: "absolute",
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ marginLeft: 8 }}>
              <img
                src="/static/images/Spector-Trades-logo-4.svg"
                alt="Spector Trades"
                height="50px"
              />
            </Box>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "space-between",
                mr: 10,
              }}
            >
              <Link
                href="/"
                underline="none"
                sx={{ marginLeft: "32px", fontWeight: "bold" }}
              >
                Dashboard
              </Link>
              <Link
                href="/newsfeed"
                underline="none"
                sx={{ marginLeft: "32px", fontWeight: "bold" }}
              >
                Newsfeed
              </Link>
              <Link
                href="/login"
                underline="none"
                sx={{ marginLeft: "32px", fontWeight: "bold" }}
              >
                Login
              </Link>
            </Box>
          </Box>

          {/*
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
