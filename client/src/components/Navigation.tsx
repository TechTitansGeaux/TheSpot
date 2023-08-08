import * as React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Toolbar } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Avatar from '@mui/material/Avatar';

const logo = require('/client/src/img/logo.jpg');
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
                <div>
                  <NavLink className='navLink' to='/Feed'>
                    <img id='nav-logo' src={logoGradient} alt='app logo' />
                  </NavLink>
                </div>
                <div>
                  <NavLink className='navLink' to='/Map'>
                    Map
                  </NavLink>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </nav>
        <Outlet />
        <footer>
          <Link to='/WebcamDisplay'>
            <AddCircleIcon color='secondary' sx={{ width: 52, height: 52 }} />
          </Link>
        </footer>
      </ThemeProvider>
    </>
  );
};

export default Navigation;
