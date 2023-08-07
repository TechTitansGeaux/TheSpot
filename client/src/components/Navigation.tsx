import * as React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to='/Feed'>Feed</NavLink>
          </li>
          <li>
            <NavLink to='/Map'>Map</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
