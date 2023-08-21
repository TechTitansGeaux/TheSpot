import localizedFormat from 'dayjs/plugin/localizedFormat';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import axios from 'axios';
import dayjs = require('dayjs');
dayjs.extend(localizedFormat);



type Props = {
  user: {
    id: number
    username: string
    displayName: string
    type: string
    geolocation: string
    mapIcon: string
    birthday: string
    privacy: null
    accessibility: null
    email: string
    picture: string
    googleId: string
    createdAt: string
    updatedAt: string
  }
  lat: number
  lng: number
  friendList: number[]
  getFriendList: () => void
  pendingFriendList: number[]
  getPendingFriendList: () => void
  loggedIn: {
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
  }
};

const addFriendTheme = createTheme({
  palette: {
    primary: {
      main: '#F0F465', // yellow
      dark: '#4CBB17', // green
      contrastText: '#0B0113',
    },
    secondary: {
      main: '#F0F465',
      dark: '#4CBB17',
      contrastText: '#0B0113',
    },
  },
});

const rmFriendTheme = createTheme({
  palette: {
    primary: {
      main: '#F0F465', // yellow
      dark: '#FF3131', // red
      contrastText: '#0B0113',
    },
    secondary: {
      main: '#F44336',
      dark: '#F44336',
      contrastText: '#0B0113',
    },
  },
});

const UserPin: React.FC<Props> = (props) => {

  const togglePopUp = () => {
    const box = document.getElementById('popUp' + props.user.username + props.user.id)

    if (box.style.display === 'block') {
      box.style.display = 'none';
    } else {
      box.style.display = 'block';
    }
  }

  // request friend ship
  const addFriend = () => {
    axios
      .post('/friends', {
        // accepter_id is user on reel
        accepter_id: props.user.id
      })
      .then(() => {
        props.getFriendList();
        props.getPendingFriendList();
      })
      .catch((err) => {
        console.error('Friend request axios FAILED', err);
      });
  };

  const removeFriend = () => {
    axios
      .delete(`/friends/${props.user.id}`)
      .then(() => {
        props.getFriendList()
        props.getPendingFriendList();
      })
      .catch((err) => {
        console.error('Remove friend request axios FAILED', err);
      });
  }

  const isNotLoggedInUser = (props.user.id !== props.loggedIn.id) || null;



  return (
    <div>
      <div className='userDot' id={props.user.username + props.user.id} onClick={togglePopUp} >
        <img
          src={props.user.mapIcon}
          alt={props.user.username}
          style={{ width: '40px', height: '40px', marginLeft: '1.5px', marginTop: '2.5px'}}
        />
      </div>
      <div className='userPopUp' id={'popUp' + props.user.username + props.user.id}>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          {props.user.displayName}
        </div>
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          @{props.user.username}
        </div>
        <div style={{ textAlign: 'center', fontSize: '15px' }}>
          <p>
            {`Member Since: ${dayjs(props.user.createdAt).format('ll')}`}
          </p>
        </div>
        <div className='addOrRmFriend'>
          {!props.pendingFriendList.includes(props.user.id) && !props.friendList.includes(props.user.id) && isNotLoggedInUser && (
            <div>
              <div style={{ position: 'relative', top: '18px', left: '80px' }}>add friend</div>
              <div style={{ position: 'relative', top: '-7.5px' }}>
                <ThemeProvider theme={addFriendTheme}>
                  <div>
                    <Box>
                      <Fab
                        size='small'
                        color='primary'
                        aria-label='add'
                        className='friend-add-btn'
                      >
                        <AddIcon onClick={() => { addFriend(); } } />
                      </Fab>
                    </Box>
                  </div>
                </ThemeProvider>
              </div>
            </div>
          )}
        </div>
        <div className='addOrRmFriend'>
          {props.friendList.includes(props.user.id) && (
            <div>
              <div style={{ position: 'relative', top: '18px', left: '60px' }}>remove friend</div>
              <ThemeProvider theme={rmFriendTheme}>
                <div>
                  <Box>
                    <Fab
                      size='small'
                      color='primary'
                      aria-label='add'
                      className='friend-add-btn'
                    >
                      <RemoveIcon onClick={() => { removeFriend(); } } />
                    </Fab>
                  </Box>
                </div>
              </ThemeProvider>
            </div>
          )}
        </div>
        <div className='addOrRmFriend'>
          {props.pendingFriendList.includes(props.user.id) && (
            <div>
              <div style={{ position: 'relative', top: '18px', left: '60px' }}>request pending</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPin;
