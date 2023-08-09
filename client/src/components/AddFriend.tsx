import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const AddFriend = () => {

  
  return (
    <ThemeProvider theme={theme}>
      <div className='friend-request'>
        <Box className="friend-box">
          <Fab
            size='small'
            color='primary'
            aria-label='add'
            className='friend-add-btn'
          >
            <AddIcon />
          </Fab>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default AddFriend;
