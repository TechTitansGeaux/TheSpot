import React from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs = require('dayjs');
dayjs.extend(localizedFormat)



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
  loggedIn: LoggedIn
};

type LoggedIn = {
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



const UserPin: React.FC<Props> = (props) => {

  const [friendList, setFriendList] = useState([]);

  const togglePopUp = () => {
    const box = document.getElementById(props.user.username + props.user.id)
    if (box.style.display === 'block') {
      box.style.display = 'none';
    } else {
      box.style.display = 'block';
    }
  }

  const requestFriendship = () => {
    console.log('your friendship is requested');

    axios
      .post('/friends', {
        // accepter_id is user on reel
        accepter_id: 1
      })
      .then((data) => {
        console.log('Friend request POSTED', data);
      })
      .catch((err) => {
        console.error('Friend request axios FAILED', err);
      });
  };

  useEffect(() => {
    axios
      .get('/feed/friendlist')
      .then(({ data }) => {
        console.log('data from friends Axios GET ==>', data);
        data.map((user: any) => {
          if (user.status === 'approved') {
            setFriendList([...friendList, user.accepter_id]);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
  }, []);

  const isNotLoggedInUser = (props.user.id !== props.loggedIn.id) || null;


  return (
    <div>
      <div className='dot' onClick={togglePopUp} >
        <img
          src={props.user.mapIcon}
          alt={props.user.username}
          style={{ width: '40px', height: '40px', marginLeft: '1.5px', marginTop: '2.5px'}}
        />
      </div>
      <div className='popUpBox' id={props.user.username + props.user.id} >
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          {props.user.username}
        </div>
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          <p>
            {`Member Since: ${dayjs(props.user.createdAt).format('ll')}`}
          </p>
        </div>
        <div className='addOrRmFriend'>
        { friendList.includes(props.user.id) && isNotLoggedInUser && (
          <ThemeProvider theme={theme}>
            <div>
              <Box>
                <Fab
                  size='small'
                  color='primary'
                  aria-label='add'
                  className='friend-add-btn'
                >
                  <AddIcon onClick={requestFriendship}/>
                </Fab>
              </Box>
            </div>
          </ThemeProvider>
        )}
        </div>
        <div className='addOrRmFriend'>
        { (
          <ThemeProvider theme={theme}>
            <div>
              <Box>
                <Fab
                  size='small'
                  color='primary'
                  aria-label='add'
                  className='friend-add-btn'
                >
                  <RemoveIcon onClick={requestFriendship}/>
                </Fab>
              </Box>
            </div>
          </ThemeProvider>
        )}
        </div>
      </div>
    </div>
  );
}


export default UserPin;
