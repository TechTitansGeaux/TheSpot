import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import fakeUsers from '../../../server/db/fakeUserData.json';
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

type User = {
  id: number;
  username: string;
  displayName: string;
  type: string;
  geolocation: string;
  mapIcon: string;
  birthday: string;
  privacy: string;
  accessibility: string;
};

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
          <Avatar
            className='friend-avatar'
            sx={{ width: 48, height: 48 }}
            alt='user_id name'
          />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default AddFriend;
