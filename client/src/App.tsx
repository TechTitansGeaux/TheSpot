import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignUp from './components/SignUp';
import Map from './components/Map/Map';
import Feed from './components/Feed/Feed';
import WebcamDisplay from './components/CreateReel/WebcamDisplay';
import Navigation from './components/Navigation';
import './global.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          exact path='/Home' element={<SignUp />}
        >
        </Route> */}
        <Route path='/' element={<Navigation />}>
          <Route path='/Feed' element={<Feed />}></Route>
          <Route path='/Map' element={<Map />}></Route>
          <Route path='/WebcamDisplay' element={<WebcamDisplay />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
