/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignUp from './components/SignUp';
import Map from './components/Map/Map';
import Feed from './components/Feed/Feed';
import WebcamDisplay from './components/CreateReel/WebcamDisplay';
import Navigation from './components/Navigation';
import './global.css';
import SignUp from './components/ProfileSetUp/SignUp';
import ProfileSetUp from './components/ProfileSetUp/ProfileSetUp';
import { useDispatch } from "react-redux";
import { setAuthUser, setIsAuthenticated } from "./store/appSlice";
import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {

  const dispatch = useDispatch();
  const [user, setUser] = useState("");

  useEffect(() => {
    fetchAuthUser();
  }, []);

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

  return (
    <BrowserRouter>
      <Routes>
      <Route
          index
          element={<SignUp />}
        ></Route>
        <Route path='/' element={<Navigation />}>
          <Route path='/ProfileSetUp' element={<ProfileSetUp />}></Route>
          <Route path='/Feed' element={<Feed />}></Route>
          <Route path='/Map' element={<Map />}></Route>
          <Route path='/WebcamDisplay' element={<WebcamDisplay />}></Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
