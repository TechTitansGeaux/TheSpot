/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Import Axios
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';

const Location: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [geolocationError, setGeolocationError] = useState<string>('');
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);

  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocationStatus(`Latitude: ${latitude}°, Longitude: ${longitude}°`);

    // Update the user's geolocation on the server using Axios
    axios
      .patch(`/users/${authUser.id}`, { geolocation: `${latitude},${longitude}` })
      .then(response => {
        // Dispatch the updated user object to the Redux store
        dispatch(setAuthUser(response.data));
      })
      .catch(error => {
        console.error(error);
        setGeolocationError('Error updating geolocation on server');
      });
  };

  const errorCallback = () => {
    setGeolocationError('Unable to retrieve your location');
    setLocationStatus('');
  };

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not supported by your browser');
    } else {
      setLocationStatus('Locating…');
      setGeolocationError('');

      navigator.geolocation.getCurrentPosition(success, errorCallback);
    }
  };

  return (
    <div>
      <h1>Yo what's the Lo?</h1>
      <button id="find-me" onClick={geoFindMe}>
        Get My Lo
      </button>
      <p id="status">{locationStatus}</p>
      {geolocationError && <p>{geolocationError}</p>}
    </div>
  );
};

export default Location;
