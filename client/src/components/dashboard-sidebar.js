import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { useCookies } from 'react-cookie';
import api from "../apis/api";
import axios from 'axios';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { UserCircle } from 'src/icons/user-circle';
let items = [
  {
    href: '/',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboard'
  },
  // {
  //   href: '/account',
  //   icon: (<UserIcon fontSize="small" />),
  //   title: 'Account'
  // },
  // {
  //   href: '/settings',
  //   icon: (<CogIcon fontSize="small" />),
  //   title: 'Settings'
  // },
  {
    href: '/login',
    icon: (<LockIcon fontSize="small" />),
    title: 'Login'
  },
  {
    href: '/register',
    icon: (<UserAddIcon fontSize="small" />),
    title: 'Register'
  },
  // {
  //   href: '/404',
  //   icon: (<XCircleIcon fontSize="small" />),
  //   title: 'Error'
  // },
  {
    href: '/newsfeed',
    icon: (<XCircleIcon fontSize="small" />),
    title: 'Newsfeed'
  }
];

const itemsAuthorized = [
  {
    href: '/',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboard'
  },
  {
    href: '/newsfeed',
    icon: (<XCircleIcon fontSize="small" />),
    title: 'Newsfeed'
  }
];

export const DashboardSidebar = (props) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['spector_jwt']);
  const [user, setUser] = useState(null);
  const [avatarImageUrl, setAvatarImageUrl] = useState(null);

  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  useEffect(() => {

    //originally async
    const fetchData = async () => {
      const token = cookies.spector_jwt;
      const config = {
        headers: { Authorization: `Bearer ${token}`}
      };
        api.get('/auth', config).then(response => {
          if (response.data['success']) {
            setIsAuthorized(true);
            setUser(response.data.user);
          }
        }).catch(err => {
          console.log(err);
        });
    };

    fetchData();

  }, []);

  useEffect(() => {
    if (user && user['avatar_url']) {
      axios.post('/api/avatar-url', {avatar_url: user.avatar_url}).then(res => {
        setAvatarImageUrl(res.data.avatar_image_url);
      });
    }
  }, [user])

  function handleClick(e) {
    e.preventDefault();
    removeCookie(["spector_jwt"]);
    setUser(null);
    setTimeout(() => {router.push('/login')}, 1000)
  }
  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
              </a>
            </NextLink>
          </Box>

          {user && (
            <Box sx={{ px: 2 }}>
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 2,
                  py: '11px',
                  borderRadius: 1
                }}
              >
                <Avatar
                  sx={{
                    height: 40,
                    width: 40,
                    ml: 1
                  }}
                  src={ avatarImageUrl }
                >
                  <UserCircle fontSize="small" />
                </Avatar>

                <div>

                  <Typography
                    color="inherit"
                    variant="subtitle1"
                  >
                    Welcome {user.name}!
                  </Typography>
                  <Typography
                    color="neutral.400"
                    variant="body2"
                  >
                    {user.email}
                  </Typography>
                </div>
              </Box>
            </Box>
          )}


        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {!isAuthorized && items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
          {isAuthorized && itemsAuthorized.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}

          {isAuthorized &&
          <NavItem
            href=""
            title="Logout"
            onClick={handleClick}
            icon={<ExitToAppIcon fontSize="small" />}
          >
            Logout
          </NavItem>}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
