import * as React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Toolbar } from '@mui/material';
import Avatar from '@mui/material/Avatar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f0f465',
      dark: '#f433ab',
      contrastText: '#0b0113',
    },
    secondary: {
      main: '#f433ab',
      dark: '#f0f465',
      contrastText: '#0b0113',
    },
  },
});

const Navigation = () => {
  return (
    <>
      <nav>
      <ThemeProvider theme={theme}>
          <AppBar position='fixed'>
            <Toolbar>
              <ul>
                <li>
                  <NavLink to='/Feed'>Feed</NavLink>
                </li>
                <li>
                  <NavLink to='/Map'>Map</NavLink>
                </li>
                <li>
                  <NavLink to='/WebcamDisplay'>WebcamDisplay</NavLink>
                </li>
              </ul>
            </Toolbar>
          </AppBar>
          </ThemeProvider>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
