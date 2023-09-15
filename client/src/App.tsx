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
import io from 'socket.io-client';
const socket = io();


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
  const [location, setLocation] = useState<string>('0, 0');
  const [geo, setGeo] = useState(false);

    // find distance (miles) with 2 points
    const distance = (lat1: number, lat2: number, lon1: number, lon2: number) => {

      lon1 = lon1 * Math.PI / 180;
      lon2 = lon2 * Math.PI / 180;
      lat1 = lat1 * Math.PI / 180;
      lat2 = lat2 * Math.PI / 180;
      // Haversine formula
      const dlon = lon2 - lon1;
      const dlat = lat2 - lat1;
      const a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.pow(Math.sin(dlon / 2),2);

      const c = 2 * Math.asin(Math.sqrt(a));

      const r = 3956;

      return (c * r * 5280);
    };

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
    if (user && location) {
    const [lat1, lng1] = user.geolocation.split(',');
    const [lat2, lng2] = location.split(',');
    // if distance b/t user and center of event is less than 300ft
    if (distance(+lat1, +lat2, +lng1, +lng2) < 150) {
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const newGeolocation = `${latitude},${longitude}`;
        setLocation(newGeolocation);
        console.log(location, '<-----LOCATION');
        console.log(user?.geolocation, '<----POSITION');
        if (authUser?.type === 'personal') {
            axios
              .patch(`/users/updateGeolocation/${authUser.id}`, { geolocation: newGeolocation })
              .then((response) => {
                dispatch(setAuthUser(response.data));
                setUser(response.data);
                socket.emit('userGeolocationUpdate', 'refresh')
              })
              .catch((error) => {
                console.error('Error updating geolocation on server:', error);
              });
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
    }
};

// testing to run only once
  useEffect(() => {
    startGeolocationWatch();
}, []); // [user, location] <- previous value

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