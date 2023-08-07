import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignUp from './components/SignUp';
import Map from './components/Map/Map';
import Feed from './components/Feed/Feed';
import Navigation from './components/Navigation';
import './global.css';
import SignUp from './SignUp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route
          index
          element={<SignUp />}
        ></Route>
        <Route path='/' element={<Navigation />}>
          <Route path='/Feed' element={<Feed />}></Route>
          <Route path='/Map' element={<Map />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
