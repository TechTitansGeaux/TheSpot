/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignUp from './components/SignUp';
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
import { AnyARecord } from 'dns';
import socketIOClient from 'socket.io-client';
import Location from './components/ProfileSetUp/Location';

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

    // Apply font size to the root element
    document.documentElement.style.fontSize = fontSize;
    fetchAuthUser();
    getAllUsers();
  }, [fontSize]);


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

// watch for user's geolocation update
useEffect(() => {
  // Establish socket connection when the component mounts
  const socket = socketIOClient(`${process.env.HOST}`);

  // Listen for geolocation updates for the user
  socket.on('userGeolocationUpdate', (userId, newGeolocation) => {
    if (authUser && userId === authUser.id) {
      // Update the user's geolocation in the state
      dispatch(setAuthUser({ ...authUser, geolocation: newGeolocation }));
    }
  });
}, []);

const startGeolocationWatch = () => {
  // Check if geolocation is supported by the browser
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by your browser');
    return null; // Return null as there's no watchId
  }

  // Start watching for geolocation updates
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      // Extract latitude and longitude from the position
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Update the user's geolocation on the server
      if (authUser) {
        const newGeolocation = `${latitude},${longitude}`;
        axios
          .patch(`/users/updateGeolocation/${authUser.id}`, { geolocation: newGeolocation })
          .then((response) => {
            console.log(newGeolocation);
            dispatch(setAuthUser(response.data));
          })
          .catch((error) => {
            console.error('Error updating geolocation on server:', error);
          });
      }
    },
    (error) => {
      console.error('Error watching geolocation:', error);
    }
  );

  return watchId; // Return the watchId
};


  return (
    <div style={{ fontSize: theme.typography.fontSize }}>
    <BrowserRouter>
      <Routes>
        <Route index element={<SignUp />}></Route>
        <Route path='/' element={<Navigation user={user} />}>
          <Route path='/ProfileSetUp' element={<ProfileSetUp startWatch={startGeolocationWatch} />}></Route>
          <Route path='/BusinessProfile' element={<BusinessProfile />}></Route>
          <Route path='/Events' element={<EventsList user={user} />}></Route>
          <Route path='/UserType' element={<UserType />}></Route>
          <Route path='/Feed' element={<Feed user={user} />}></Route>
          <Route
            path='/FriendRequests'
              element={<FriendRequestList allUsers={allUsers}  user={user} />}
          ></Route>
          <Route
            path='/Follows'
              element={<FollowersList allUsers={allUsers}  user={user} />}
          ></Route>
          <Route path='/Likes' element={<LikesList allUsers={allUsers} user={user} />}></Route>
          <Route
            path='/Settings'
            element={<Settings startWatch={startGeolocationWatch} fontSize={fontSize} />}
          ></Route>
          <Route path='/BusinessSettings' element={<BusinessSettings fontSize={fontSize}/>}></Route>
          <Route
            path='/CreateReel'
            element={<CreateReel user={user} />}
          ></Route>
          <Route path='/Map' element={<Map reelEvent={null} loggedIn={user} />}></Route>
        </Route>
        <Route path='/Location' element={<Location startWatch={startGeolocationWatch} />}></Route>
      </Routes>
    </BrowserRouter>
    </div>

  );
};

export default App;