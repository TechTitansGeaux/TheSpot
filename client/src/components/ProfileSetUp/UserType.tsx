/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UserType = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const [type, setType] = useState('');
  const [buttonClicked, setButtonClicked] = useState('');

  useEffect(() => {
    if (authUser) {
      console.log(authUser);
    }
  }, [authUser]);

  const handleProfileSelection = (profileType: any) => {
    setType(profileType);
    setButtonClicked(profileType); // Store the clicked button's type

    const profileData = {
      type: profileType,
    };

    axios
      .patch(`/users/${authUser.id}`, profileData)
      .then((response) => {
        dispatch(setAuthUser(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRedirect = () => {
    if (type === 'personal') {
      window.location.href = `${process.env.HOST}/ProfileSetUp`;
    } else if (type === 'business') {
      window.location.href = `${process.env.HOST}/BusinessProfile`;
    }
  };

  return (
    <Container className="container-full-w center">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h1">
          Choose Your Profile Type
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          onClick={() => handleProfileSelection('personal')}
          disabled={buttonClicked === 'personal'} // Disable only if 'personal' button was clicked
        >
          Party Goer
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          onClick={() => handleProfileSelection('business')}
          disabled={buttonClicked === 'business'} // Disable only if 'business' button was clicked
        >
          Party Thrower
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          onClick={handleRedirect}
          disabled={!buttonClicked} // Enable 'Continue' button only if one of the profile type buttons was clicked
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
};

export default UserType;
