import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Button from '@mui/material/Button';

const Location: React.FC<{ startWatch: () => void }> = ({ startWatch }) => {
  const [status, setStatus] = useState<{ text: string; error?: string }>({ text: '' });
  const authUser = useSelector((state: RootState) => state.app.authUser);

  useEffect(() => {
    if (authUser?.geolocation) {
      setStatus({
        text: 'For the best experience, we will need your location. Click the button above!',
      });
    }
  }, [authUser]);

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      setStatus({ text: 'Geolocation is not supported by your browser', error: 'An error occurred' });
    } else {
      startWatch();
      setStatus({ text: 'Cool, see ya there!' });
    }
  };

  return (
    <div>
      {authUser ? (
        <Button
          id="find-me"
          variant="contained"
          color="secondary"
          onClick={geoFindMe}
          style={{ margin: '1rem 0' }}
        >
          Get My Lo
        </Button>
      ) : (
        <p>You must be authenticated to retrieve your geolocation.</p>
      )}
      <p className="center" id="status" style={{ color: 'var(--violet)' }}>
        {status.text}
      </p>
      {status.error && <p>{status.error}</p>}
    </div>
  );
};

export default Location;
