/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import axios from 'axios';
import './navigation.css';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';
import Button from '@mui/material/Button';
import { setAuthUser } from '../store/appSlice';
import { RootState } from '../store/store';
const logoGradient = require('/client/src/img/logo-gradient.jpg');
const socket = io();

type Anchor = 'left';
type Props = {
  user: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string;
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  },
};

const listStyles = {
  '&:hover': { backgroundColor: '#f0f465', color: '#11011e' },
  '&:focus': { backgroundColor: '#f0f465', color: '#11011e' },
  '&:focus-visible': { backgroundColor: '#f0f465', color: '#11011e' },
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b0113',
      dark: '#f433ab',
      contrastText: '#F5FCFA',
    },
    secondary: {
      main: '#f433ab',
      light: '#f0f465',
      contrastText: '#0b0113',
    },
  },
});

const Navigation: React.FC<Props> = ({ user }) => {
  const [pFriends, setPFriends] = useState([]); // pending friends list
  const [open, setOpen] = useState(false); // open and close snackbar
  const [likesArr, setLikesArr] = useState([]); // user's own reels that have been liked FROM likes table
  const [following, setFollowing] = useState([]); // user's followers that haven't been checked

  const [onPage, setOnPage] = useState(
    <NavLink className='navLink' to='/Feed'>
      <img id='nav-logo' src={logoGradient} alt='TheSpot' />
    </NavLink>
  );
  const location = useLocation();
  const feedPath = location.pathname;
  const [setting, setSetting] = useState('');
  const [bottomNavHidden, setBottomNavHidden] = useState(false) // boolean state var to hide bottom nav
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);

  useEffect(() => {
    if (feedPath === '/CreateReel' || feedPath === '/UserType' || feedPath === '/ProfileSetUp' || feedPath === '/BusinessProfile') {
      setBottomNavHidden(true)
    } else {
      setBottomNavHidden(false)
    }
  }, [feedPath])

  const handleLogout = () => {
    // logout the user by clearing the authUser state
    dispatch(setAuthUser(null));
    // redirect the user to the homepage
    window.location.href = `${process.env.HOST}/`;
  };

  // get all pending friends for current user
  const getAllPFriends = () => {
    if (user?.type === 'personal') {
      axios
        .get('feed/friendlist/pending')
        .then((response) => {
          // console.log('pending friends:', response.data);
          setPFriends(response.data);
        })
        .catch((err) => {
          console.error('Could not GET pending friends:', err);
        });
    }
  };

  useEffect(() => {
    getAllPFriends();

    const interval = setInterval(() => {
      getAllPFriends();
    }, 7000);

    return () => {
      clearInterval(interval);
    }

  }, [location.pathname, user]);

  // get reels that have been liked
  const getLikes = () => {
    if (user) {
      axios
        .get('/likes/likesusernull')
        .then((response) => {
          setLikesArr(response.data);
        })
        .catch((err) => {
          console.error('Could not GET all likes:', err);
        });
    }
  };

  useEffect(() => {
    getLikes();

    socket.on('likeSent', (data) => {
      getLikes();
    });
  }, [socket, location.pathname]);

  // once you click on likes sidebar, set likes checked column to true
  const checkedLikes = () => {
    for (let i = 0; i < likesArr.length; i++) {
      const id = likesArr[i].id;
      axios
        .put(`/likes/checked/${id}`)
        .then((response) => {
          console.log('updated LIKES table column checked');
        })
        .catch((err) => {
          console.error('Did not update LIKES checked column', err);
        })
    }
    setLikesArr([]);
  };

  // get followers for user and followers notifications
  const getAllFollowers = () => {
    if (user?.type === 'business') {
      const followers: any = []; // followers that haven't been checked
      axios
        .get('/followers')
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].checked !== true) {
              followers.push(response.data[i]);
            }
          }
          setFollowing(followers);
        })
        .catch((err) => {
          console.error('Could not GET all followers:', err);
        })
    }
  };

  useEffect(() => {
    getAllFollowers();

    socket.on('follower', (data) => {
      getAllFollowers();
    });
  }, [socket, location.pathname]);

  // once you click followers on sidebar, set followers checked column to true
  const checkedFollowers = () => {
    for (let i = 0; i < following.length; i++) {
      const id = following[i].id;
      axios
        .put(`followers/checked/${id}`)
        .then((response) => {
          console.log('updated Followers table column checked');
        })
        .catch((err) => {
          console.error('Did not update Followers checked column', err);
        })
    }
  };

  // When the user clicks on the button, scroll to the top of the page
  const handleScrollTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox
  };

  // if location on feed then change logo button to scroll
  useEffect(() => {
    if (feedPath === '/Feed') {
      getAllPFriends();
      setOnPage(
        <NavLink className='navLink' to={null} onClick={handleScrollTop}>
          <img
            id='nav-logo'
            src={logoGradient}
            alt='TheSpot'
          />
        </NavLink>
      );
    } else {
      getAllPFriends();
      setOnPage(
        <NavLink className='navLink' to='/Feed'>
          <img
            id='nav-logo'
            src={logoGradient}
            alt='TheSpot'
          />
        </NavLink>
      );
    }
  }, [location.pathname]);

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, left: open });
    };

    // const settingsType = () => {
      useEffect(() => {
        if (user) {
          if (user.type === 'personal' || user.type === null) {
            // Redirect to '/Settings' for personal user type
            setSetting('/Settings');
          } else if (user.type === 'business') {
            // Redirect to '/BusinessSettings' for business user type
            setSetting('/BusinessSettings');
          }
        }
      }, [user]);
      // return setting;

    // Snackbar stuff
    useEffect(() => {
      if (pFriends.length > 0) {
        setOpen(true);
      }
    }, [pFriends.length]);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

  // Need to Update My Reels // to={<my reels component>}
  const list = (anchor: Anchor) => (
    <Box
      sx={{ color: '#F5FCFA' }}
      className='drawer-container'
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ paddingTop: '4em' }}>
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={'/MyReels'}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
          >
            MY REELS
          </ListItemButton>
        </ListItem>
        {user?.type === 'personal' && (
          <ListItem className='drawer-btn' disablePadding>
            <ListItemButton
              className='sidebar-btn'
              component={Link}
              to={'/FriendRequests'}
              sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
            >
              FRIENDS
              <span>
                {pFriends.length !== 0 && (
                  <CircleNotificationsIcon
                    className='circle'
                    sx={{ marginLeft: 1 }}
                  />
                )}
              </span>
            </ListItemButton>
          </ListItem>
        )}
        {user?.type === 'business' && (
          <ListItem className='drawer-btn' disablePadding>
            <ListItemButton
              className='sidebar-btn'
              component={Link}
              to={'/Follows'}
              sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
              onClick={checkedFollowers}
            >
              FOLLOWERS
              <span>
                {following.length !== 0 && (
                  <CircleNotificationsIcon
                    className='circle'
                    sx={{ marginLeft: 1 }}
                  />
                )}
              </span>
            </ListItemButton>
          </ListItem>
        )}
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={'/Events'}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
          >
            EVENTS
          </ListItemButton>
        </ListItem>
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={'/Likes'}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
            onClick={checkedLikes}
          >
            LIKES
            <span>
              {likesArr.length !== 0 && (
                <CircleNotificationsIcon className='circle' />
              )}
            </span>
          </ListItemButton>
        </ListItem>
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={setting}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
          >
            SETTINGS
          </ListItemButton>
        </ListItem>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20rem', paddingLeft: '1em' }}>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
      </List>
    </Box>
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <nav className='toolbar-container'>
          <div className='navbar-container'>
            <NavLink className='navLink mapLink' to='/Map'>
              Map
            </NavLink>
            {onPage}
            <div className='avatar-container'>
              <div onClick={toggleDrawer('left', true)}>
                <Tooltip
                  title='See Profile'
                  TransitionComponent={Zoom}
                  placement='left'
                  PopperProps={{
                    sx: {
                      '& .MuiTooltip-tooltip': {
                        backgroundColor: 'transparent',
                        border: 'solid #F5FCFA 1px',
                        color: '#F5FCFA',
                      },
                    },
                  }}
                >
                  <Avatar
                    src={user?.picture}
                    alt='User Picture'
                    className='nav-avatar'
                    sx={{ width: 45, height: 45 }}
                  />
                </Tooltip>
              </div>
              {(likesArr.length !== 0 ||
                pFriends.length !== 0 ||
                following.length !== 0) && (
                <CircleNotificationsIcon
                  className='circle'
                  sx={{
                    position: 'absolute',
                    right: '-25%',
                    top: '0%',
                    zIndex: '4',
                  }}
                />
              )}
            </div>
          </div>
        </nav>
        <Outlet />
        <div>
          <Drawer
            open={state['left']}
            anchor={'left'}
            onClose={toggleDrawer('left', false)}
          >
            {' '}
            {list('left')}
          </Drawer>
        </div>
        <footer>
          {!bottomNavHidden && (
            <div className='create-reel-btn-container'>
              <Link to='/CreateReel'>
                <AddCircleIcon
                  className='create-reel-btn'
                  color='secondary'
                  sx={{ width: 52, height: 52}}
                />
              </Link>
            </div>
          )}
          <div>
            {pFriends.length !== 0 && (
              <div>
                <Snackbar
                  variant='theSpot-pink'
                  open={open}
                  autoHideDuration={6000}
                  onClick={handleClose}
                  message='You have pending friends request(s)'
                  action={action}
                />
              </div>
            )}
          </div>
        </footer>
      </ThemeProvider>
    </>
  );
};

export default Navigation;
