import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import UserPin from './UserPin';


const Map = () => {

  const [ users, setUsers ] = useState([])

  useEffect(() => {
    axios.get('/users')
      .then((res) => {
        setUsers(res.data)
      })
      .catch((err) => {
        console.log('error getting users', err);
      });
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: '75vh', width: '80%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
          defaultZoom={15}
          defaultCenter={{lat: 29.917448559152003, lng: -90.10073471661711}}
        >{
          users.map((user, i) => {
            return <UserPin user={user} key={i} lat={29.917448559152003} lng={ -90.10073471661711} />
          })
        }</GoogleMapReact>
      </div>

    </div>

  );
};

export default Map;
