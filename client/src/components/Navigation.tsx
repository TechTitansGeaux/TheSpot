import * as React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
                  <NavLink className='navLink' to='/Settings' style={{ marginLeft: '10px' }}>
                        Settings
                  </NavLink>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </nav>
        <Outlet />
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