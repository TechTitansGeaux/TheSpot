import localizedFormat from 'dayjs/plugin/localizedFormat';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
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
  latitude: number
  longitude: number
  friendList: number[]
  pendingFriendList: number[]
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
  getPendingFriendList: () => void
  getFriendList: () => void
  setZoom: (zoom: number) => void
  setCenter: (center: object) => void
  closeAllPopUps: () => void
  zoom: number
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

const UserPin: React.FC<Props> = ({ user, loggedIn, lat, lng, zoom, friendList, pendingFriendList, getFriendList, getPendingFriendList, setZoom, setCenter }) => {

  const togglePopUp = () => {
    const box = document.getElementById('popUp' + user.username + user.id)
    if (box.style.display === 'block') {
      box.style.animationName = 'popOff';
      setTimeout(() => {
        box.style.display = 'none';
      }, 500)
    } else {
      box.style.animationName = 'popOut';
      box.style.display = 'block';
    }
  }

  // request friend ship
  const addFriend = () => {
    axios
      .post('/friends', {
        // accepter_id is user on reel
        accepter_id: user.id
      })
      .then(() => {
        getFriendList();
        getPendingFriendList();
      })
      .catch((err) => {
        console.error('Friend request axios FAILED', err);
      });
  };

  const removeFriend = () => {
    axios
      .delete(`/friends/removeFriend/${user.id}`, { data: { updatedAt: user.updatedAt }})
      .then(() => {
        getFriendList()
        getPendingFriendList();
      })
      .catch((err) => {
        console.error('Remove friend request axios FAILED', err);
      });
  }

  const isNotLoggedInUser = (user.id !== loggedIn.id) || null;



  return (
    <div>
      <div className='userDot' id={user.username + user.id} onClick={ () => {
        if (zoom < 15) {
          setZoom(15);
          setCenter({lat: lat - 0.005, lng: lng});
        } else {
          setCenter({lat: lat - (0.005 / ( 2 ** (zoom - 15))), lng: lng});
        }
        togglePopUp();
      } } >
        <img
          src={user.mapIcon}
          style={{ width: '40px', height: '40px', marginLeft: '1.5px', marginTop: '2.5px'}}
        />
      </div>
      <div className='userPopUp' id={'popUp' + user.username + user.id}>
        <div style={{ textAlign: 'center', fontSize:'20px', marginTop: '5px' }}>
          {user.displayName}
        </div>
        <div style={{ textAlign: 'center', fontSize: '15px' }}>
          @{user.username}
        </div>
        <div style={{ textAlign: 'center', fontSize: '15px', marginBottom: '10px' }}>
          <p>
            {`Joined: ${dayjs(user.createdAt).format('ll')}`}
          </p>
        </div>
        <div className='addOrRmFriend'>
          {!pendingFriendList.includes(user.id) && !friendList.includes(user.id) && isNotLoggedInUser && (
            <div style={{ position: 'relative', top: '-166.5px', left: '-50%', marginBottom: '10px' }}>
              <ThemeProvider theme={addFriendTheme}>
                <div>
                  <Box>
                    <Fab
                      variant="extended"
                      size="small"
                      color="primary"
                      className='friend-add-btn'
                      onClick={() => { addFriend(); } }
                    > Add Friend
                    </Fab>
                  </Box>
                </div>
              </ThemeProvider>
            </div>
          )}
        </div>
        <div className='addOrRmFriend'>
          {friendList.includes(user.id) && (
            <div style={{ position: 'relative', top: '-166.5px', left: '-57.5%', marginBottom: '10px' }}>
              <ThemeProvider theme={rmFriendTheme}>
                <div>
                  <Box>
                    <Fab
                      variant="extended"
                      size="small"
                      color="primary"
                      className='friend-add-btn'
                      onClick={() => { removeFriend(); } }
                    > Remove Friend
                    </Fab>
                  </Box>
                </div>
              </ThemeProvider>
            </div>
          )}
        </div>
        <div className='addOrRmFriend'>
          {pendingFriendList.includes(user.id) && (
            <div>
              <div style={{ position: 'relative', top: '-170px', marginBottom: '10px', left: '70px', fontSize: '15px' }}>request pending</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


