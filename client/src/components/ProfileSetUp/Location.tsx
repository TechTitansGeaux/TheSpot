/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';
import Button from '@mui/material/Button';


const Location: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [geolocationError, setGeolocationError] = useState<string>('');
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);

  useEffect(() => {
    if (authUser) {
      setLocationStatus(`Your geolocation: ${authUser.geolocation}`);
    }
  }, [authUser]);

  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocationStatus(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    setStatus('Cool, see ya there!');

    if (authUser) {
      // Update the user's geolocation on the server using Axios
      const newGeolocation = `${latitude},${longitude}`;
      axios
        .patch(`/users/updateGeolocation/${authUser.id}`, { geolocation: newGeolocation })
        .then(response => {
          // Dispatch the updated user object to the Redux store
          dispatch(setAuthUser(response.data));
        })
        .catch(error => {
          console.error(error);
          setGeolocationError('Error updating geolocation on server');
        });
    } else {
      console.error('User not authenticated');
    }
  };

  const errorCallback = () => {
    setGeolocationError('Unable to retrieve your location');
    setLocationStatus('');
  };

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating…');
      setGeolocationError('');

      navigator.geolocation.watchPosition(success, errorCallback);
    }
  };

  return (
    <div>
      {authUser ? (
        <Button id="find-me"
        variant="contained"
        color="secondary"
        onClick={geoFindMe}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          Get My Lo
        </Button>
      ) : (
        <p>You must be authenticated to retrieve your geolocation.</p>
      )}
      <p className='center' id="status" style={{ color: 'var(--violet)' }}>{status}</p>
      {geolocationError && <p>{geolocationError}</p>}
    </div>
  );
};

export default Location;
