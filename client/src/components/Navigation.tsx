import * as React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import ListItem  from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import axios from 'axios';

type Anchor = 'left';

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

const Navigation = () => {
  const [pFriends, setPFriends] = useState([]); // pending friends list
  const [notifBool, setNotifBool] = useState(false);

  // get all pending friends for current user
  const getAllPFriends = () => {
    axios
      .get('feed/friendlist/pending')
      .then((response) => {
        console.log('pending friends:', response.data);
        setPFriends(response.data);
        if (pFriends.length !== 0) {
          setNotifBool(true);
        } else {
          setNotifBool(false);
        }
      })
      .catch((err) => {
        console.error('Could not GET pending friends:', err);
      });
  };

  useEffect(() => {
    getAllPFriends();
    console.log('notifBool:', notifBool);
  }, [notifBool]);

  const [onPage, setOnPage] = useState(
    <NavLink className='navLink' to='/Feed'>
      <img id='nav-logo' src={logoGradient} alt='app logo' />
    </NavLink>
  );
  const location = useLocation();
  const feedPath = location.pathname;
  // console.log('feedPath', feedPath);

  // When the user clicks on the button, scroll to the top of the page
  const handleScrollTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  // if location on feed then change logo button to scroll
  useEffect(() => {
    if (feedPath === '/Feed') {
      setOnPage(
        <button className='navLink' onClick={handleScrollTop}>
          <img id='nav-logo' src={logoGradient} alt='app logo' />
        </button>
      );
    } else {
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

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 400, color: '#F5FCFA' }}
      className='drawer-container'
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ paddingTop: '3em' }}>
        {['Profile', 'Friend Requests', 'Likes', 'Settings'].map(
          (text, index) => (
            <ListItem key={text} color='secondary' disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index === 3 && (
                    <NavLink
                      className='navLink'
                      to='/Settings'
                      style={{ marginLeft: '10px' }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <nav>
          <AppBar position='fixed'>
            <Toolbar
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'rgba(11, 1, 19, .75)',
              }}
            >
              <div className='navbar-container'>
                <div>{onPage}</div>
                <div>
                  <NavLink className='navLink' to='/Map'>
                    Map
                  </NavLink>
                </div>

                <div>
                  <NavLink
                    className='navLink'
                    to='/Settings'
                    style={{ marginLeft: '10px' }}
                  >
                    Settings
                  </NavLink>
                </div>
                <button
                  className='navLink'
                  onClick={toggleDrawer('left', true)}
                >
                  <Avatar
                    className='friend-avatar'
                    sx={{ width: 48, height: 48 }}
                  />
                </button>
              </div>
            </Toolbar>
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