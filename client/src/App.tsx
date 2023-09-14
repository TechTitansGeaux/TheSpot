/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from './components/Map/Map';
import Feed from './components/Feed/Feed';
import CreateReel from './components/CreateReel/CreateReel';
import Navigation from './components/Navigation';
import './global.css';
import SignUp from './components/ProfileSetUp/SignUp';
import ProfileSetUp from './components/ProfileSetUp/ProfileSetUp';
import BusinessProfile from './components/ProfileSetUp/BusinessProfile';
import UserType  from './components/ProfileSetUp/UserType';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Settings from './components/ProfileSetUp/Settings';
import BusinessSettings from './components/ProfileSetUp/BusinessSettings';
import FriendRequestList from './components/UserProfile/FriendRequests/FriendRequestList';
import FollowersList from './components/UserProfile/Followers/FollowersList';
import LikesList from './components/UserProfile/Likes/LikesList';
import EventsList from './components/UserProfile/Events/EventsList';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setIsAuthenticated, setFontSize } from './store/appSlice';
import { RootState } from './store/store';
import { useTheme } from '@mui/material/styles';


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
  email: string;
  picture: string;
  googleId: string;
};

const App = () => {
  const theme = useTheme();
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const dispatch = useDispatch();
  // get all users to pass down as props
  const [user, setUser] = useState<User>(null);
  const fontSize = useSelector((state: RootState) => state.app.fontSize); // Default font size
  const [allUsers, setAllUsers] = useState<[User]>(null);
  const [location, setLocation] = useState<User>(null);

  const fetchAuthUser = async () => {
    try {
      const response = await axios.get(`/users/user`);

      if (response && response.data) {
        dispatch(setIsAuthenticated(true));
        dispatch(setAuthUser(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    dispatch(setFontSize(fontSize));
    document.documentElement.style.fontSize = fontSize;
    fetchAuthUser();
    getAllUsers();
  }, [fontSize]);

  const startGeolocationWatch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        if (authUser?.type === 'personal') {
          const newGeolocation = `${latitude},${longitude}`;
          if (String(position) !== newGeolocation) {
            console.log(newGeolocation, '<-----NEWGEOLO');
            axios
              .patch(`/users/updateGeolocation/${authUser.id}`, { geolocation: newGeolocation })
              .then((response) => {
                dispatch(setAuthUser(response.data));
              })
              .catch((error) => {
                console.error('Error updating geolocation on server:', error);
              });
            }
        }
      },
      (error) => {
        console.error('Error watching geolocation:', error);
      },
      {
        enableHighAccuracy: true
      }
    );
  } else {
    console.error('Geolocation is not supported by your browser');
  }
};

useEffect(() => {
  startGeolocationWatch();
}, [location]);


  // get all other users
  const getAllUsers = async () => {
    try {
      const response = await axios.get('/users/');

      if (response && response.data) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('error in getAllUsers App', error);
    }
  }

  useEffect(() => {
    getLocation();
  }, [authUser])

  const getLocation = () => {
    setLocation(authUser?.geolocation);
  }

  return (
    <div style={{ fontSize: theme.typography.fontSize }}>
    <BrowserRouter>
      <Routes>
        <Route index element={<SignUp />}></Route>
        <Route path='/' element={<Navigation user={user} />}>
          <Route path='/ProfileSetUp' element={<ProfileSetUp />}></Route>
          <Route path='/BusinessProfile' element={<BusinessProfile />}></Route>
          <Route path='/Events' element={<EventsList user={user} />}></Route>
          <Route path='/UserType' element={<UserType />}></Route>
          <Route path='/Feed' element={<Feed user={user} />}></Route>
          <Route path='/FriendRequests' element={<FriendRequestList allUsers={allUsers} user={user} />} ></Route>
          <Route path='/Follows' element={<FollowersList allUsers={allUsers}  user={user} />}></Route>
          <Route path='/Likes' element={<LikesList user={user} />}></Route>
          <Route path='/Settings' element={<Settings fontSize={fontSize} />} ></Route>
          <Route path='/BusinessSettings' element={<BusinessSettings fontSize={fontSize}/>}></Route>
          <Route path='/CreateReel' element={<CreateReel user={user} />} ></Route>
          <Route path='/Map' element={<Map reelEvent={null} loggedIn={user} />}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;