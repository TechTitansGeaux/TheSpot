import * as React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import axios from 'axios';
import './navigation.css';
// import Badge from '@mui/material/Badge';

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
  };
};

const logoGradient = require('/client/src/img/logo-gradient.jpg');
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
  const [userReels, setUserReels] = useState([]); // logged in user's reels
  const likes: any = []; // user's reels that have been liked

  const [onPage, setOnPage] = useState(
    <NavLink className='navLink' to='/Feed'>
      <img id='nav-logo' src={logoGradient} alt='app logo' />
    </NavLink>
  );
  const location = useLocation();
  const feedPath = location.pathname;

  // get all pending friends for current user
  const getAllPFriends = () => {
    axios
      .get('feed/friendlist/pending')
      .then((response) => {
        // console.log('pending friends:', response.data);
        setPFriends(response.data);
      })
      .catch((err) => {
        console.error('Could not GET pending friends:', err);
      });
  };

  useEffect(() => {
    getAllPFriends();

    const interval = setInterval(() => {
      getAllPFriends();
    }, 5000);

    return () => {
      clearInterval(interval);
    }

  }, [location.pathname, user]);

  // get your own reels
  const getOwnReels = () => {
    axios
      .get('/feed/reel/user')
      .then((response) => {
        console.log('users own reels:', response.data);
        setUserReels(response.data);
      })
      .catch((err) => {
        console.error('Could not GET user reels:', err);
      });
  };

  useEffect(() => {
    getOwnReels();
  }, [location.pathname, user]);

  // get reels that have been liked
  const getLikes = () => {
    if (user) {
      axios
        .get('/feed/likesTable')
        .then((response) => {
          console.log('likes:', response.data);
          for (let i = 0; i < response.data.length; i++) {
            if (user.id === response.data[i].UserId) {
              likes.push(response.data[i]);
            }
          }
        })
        .catch((err) => {
          console.error('Could not GET all likes:', err);
        });
    }
  };

  useEffect(() => {
    getLikes();
  }, [user]);

  // When the user clicks on the button, scroll to the top of the page
  const handleScrollTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  // if location on feed then change logo button to scroll
  useEffect(() => {
    if (feedPath === '/Feed') {
      getAllPFriends();
      setOnPage(
        <button className='navLink' onClick={handleScrollTop}>
          <img id='nav-logo' src={logoGradient} alt='app logo' />
        </button>
      );
    } else {
      getAllPFriends();
      setOnPage(
        <NavLink className='navLink' to='/Feed'>
          <img id='nav-logo' src={logoGradient} alt='app logo' />
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

  // Need to Update My Reels // to={<my reels component>}
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 400, color: '#F5FCFA' }}
      className='drawer-container'
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ paddingTop: '3em' }}>
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={'/Feed'}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
          >
            MY REELS
          </ListItemButton>
        </ListItem>
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={'/FriendRequests'}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
          >
            FRIEND REQUESTS
            <span>
              {pFriends.length !== 0 &&
                <CircleNotificationsIcon className="circle" />
              }
            </span>
          </ListItemButton>
        </ListItem>
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
          >
            LIKES
          </ListItemButton>
        </ListItem>
        <ListItem className='drawer-btn' disablePadding>
          <ListItemButton
            className='sidebar-btn'
            component={Link}
            to={'/Settings'}
            sx={{ minHeight: '4em', paddingLeft: '1.5em' }}
          >
            SETTINGS
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <nav>
          <AppBar position='fixed'>
            <div className='toolbar-container'>
              <Toolbar
                sx={{
                  display: 'flex',
                  backgroundColor: 'rgba(11, 1, 19, .75)',
                }}
              >
                <div className='navbar-container'>
                  <div>{onPage}</div>
                  <div>
                    <NavLink className='navLink mapLink' to='/Map'>
                      Map
                    </NavLink>
                  </div>
                    <div>
                      {pFriends.length !== 0 &&
                        <CircleNotificationsIcon className="circle" />
                      }
                    </div>
                  <div onClick={toggleDrawer('left', true)}>
                    <Tooltip
                      title='Open Settings'
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
                        className='friend-avatar'
                        sx={{ width: 48, height: 48 }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </Toolbar>
            </div>
          </AppBar>
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
          <Link to='/CreateReel'>
            <AddCircleIcon color='secondary' sx={{ width: 52, height: 52 }} />
          </Link>
        </footer>
      </ThemeProvider>
    </>
  );
};

export default Navigation;
