/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7161EF',
      dark: '#f433ab',
      contrastText: '#F5FCFA',
    },
    secondary: {
      main: '#f433ab',
      light: '#f0f465',
      contrastText: '#e3f2fd',
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <Container className="container-full-w center">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="75vh" width='auto'>
          <Typography variant="h4" style={{ padding: '0px', margin: '0' }}>
            Choose Profile Type
          </Typography>
          <Card style={{ backgroundColor: 'var(--yellow)', marginTop: '1rem' }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Radio
                    color="secondary"
                    checked={buttonClicked === 'personal'}
                    onChange={() => handleProfileSelection('personal')}
                  />
                }
                label="Personal"
                style={{ marginTop: '1rem', marginBottom: '1rem' }}
              />
              <FormControlLabel
                control={
                  <Radio
                    color="secondary"
                    checked={buttonClicked === 'business'}
                    onChange={() => handleProfileSelection('business')}
                  />
                }
                label="Business"
                style={{ marginTop: '1rem', marginBottom: '1rem' }}
              />
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: '1rem', marginBottom: '1rem' }}
                onClick={handleRedirect}
                disabled={!buttonClicked} // Enable 'Continue' button only if one of the profile type buttons was clicked
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UserType;
