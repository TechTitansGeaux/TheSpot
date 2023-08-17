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
import Settings from './components/ProfileSetUp/Settings'
import FriendRequestList from './components/UserProfile/FriendRequests/FriendRequestList';
import LikesList from './components/UserProfile/Likes/LIkesList';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setIsAuthenticated, setFontSize } from './store/appSlice';
import { RootState } from './store/store';
import { useTheme } from '@mui/material/styles';


type User = {
  id: number;
  username: string;
  displayName: string;
  type: string;
  geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
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

  const dispatch = useDispatch();
  // get all users to pass down as props
  const [user, setUser] = useState<User>(null);
  const fontSize = useSelector((state: RootState) => state.app.fontSize); // Default font size

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
  }, [fontSize]);


  return (
    <div style={{ fontSize: theme.typography.fontSize }}>
    <BrowserRouter>
      <Routes>
        <Route index element={<SignUp />}></Route>
        <Route path='/' element={<Navigation user={user} />}>
          <Route path='/ProfileSetUp' element={<ProfileSetUp />}></Route>
          <Route path='/BusinessProfile' element={<BusinessProfile />}></Route>
          <Route path='/UserType' element={<UserType />}></Route>
          <Route path='/Feed' element={<Feed user={user} />}></Route>
          <Route
            path='/FriendRequests'
            element={<FriendRequestList user={user} />}
          ></Route>
          <Route path='/Likes' element={<LikesList user={user} />}></Route>
          <Route
            path='/Settings'
            element={<Settings fontSize={fontSize} />}
          ></Route>
          <Route
            path='/CreateReel'
            element={<CreateReel user={user} />}
          ></Route>
          <Route path='/Map' element={<Map loggedIn={user} />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;