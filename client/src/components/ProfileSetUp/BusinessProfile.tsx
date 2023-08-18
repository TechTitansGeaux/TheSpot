/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';
// import Location from './Location';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import UploadFile from '@mui/icons-material/UploadFile';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SpeechToText from '../ProfileSetUp/SpeechToText';
import LocationSearchInput from './LocationSearchInput';


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
      contrastText: '#0b0113',
    },
  },
});

const BusinessProfile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [picture, setPicture] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [geolocation, setGeolocation] = useState('');
  const [selectedMapIcon, setSelectedMapIcon] = useState('');
  const [privacy, setPrivacy] = React.useState('');
  const [errors, setErrors] = useState({
    username: '',
    displayName: '',
    birthday: '',
    picture: '',
    geolocation: '',
    mapIcon: '',
    uploadImage: '',
    saveProfile: '',
    privacy: '',
  });

  useEffect(() => {
    if (authUser) {
      setPicture(authUser.picture);
      setGeolocation(authUser.geolocation);
    }
  }, [authUser]);

  const handleBusinessProfile = async () => {
    const newErrors = { ...errors };

    if (!username) {
      newErrors.username = 'Username is required.';
    } else {
      newErrors.username = '';
    }

    if (!displayName) {
      newErrors.displayName = 'Display Name is required.';
    } else {
      newErrors.displayName = '';
    }

    if (!geolocation) {
      newErrors.geolocation = 'Geolocation is required.';
    } else {
      newErrors.geolocation = '';
    }

    if (!birthday) {
      newErrors.birthday = 'Birthday is required.';
    } else {
      newErrors.birthday = '';
    }

    if (!selectedMapIcon) {
      newErrors.mapIcon = 'Please select a map icon.';
    } else {
      newErrors.mapIcon = '';
    }

    if (!privacy) {
      newErrors.privacy = 'Please select a map icon.';
    } else {
      newErrors.privacy = '';
    }

    setErrors(newErrors);

    if (
      newErrors.username ||
      newErrors.displayName ||
      newErrors.geolocation ||
      newErrors.birthday ||
      newErrors.mapIcon ||
      newErrors.privacy
    ) {
      return;
    }

    const profileData = {
      username,
      displayName,
      geolocation,
      birthday,
      picture,
      mapIcon: selectedMapIcon,
      privacy
    };

    axios
      .patch(`/users/${authUser.id}`, profileData)
      .then((response) => {
        dispatch(setAuthUser(response.data));
        window.location.href = `${process.env.HOST}/Feed`;
      })
      .catch((error) => {
        console.error(error);
        setErrors({ ...errors, saveProfile: 'An error occurred while saving your profile. Please try again later.' });
      });
};




  const handleImageChange = (event: any) => {
    setSelectedImage(event.target.files[0]);
    setIsImageSelected(true);
  };

  const uploadImageToServer = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(`/users/uploadImage/${authUser.id}`, formData);

      if (response && response.data) {
        dispatch(setAuthUser(response.data));
        setPicture(authUser.picture);
        setSelectedImage(null);
        setIsImageSelected(false);
      }
    } catch (error) {
      console.error(error);
      setErrors({ ...errors, uploadImage: 'An error occurred while uploading the image. Please try again later.' });
    }
  };





  // const handleTranscriptChange = (newTranscript: any) => {
  //   //  use the newTranscript value to update the relevant text field
  //   return newTranscript; //updating displayName with transcript
  // };


  return (
    <ThemeProvider theme={theme}>
      <Container className="container-full-w center">
        <h1>Business Profile Setup</h1>
        <p>Click Avatar To Edit Image</p>
        <Card style={{ backgroundColor: 'var(--yellow)', marginTop: '1rem' }}>
          <CardContent>
            <div className='flex-container center' style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Avatar
                src={picture}
                alt="User Picture"
                className='rounded-circle mb-3'
                sx={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => document.getElementById('imageInput').click()}
              />
              <input
                type="file"
                id="imageInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
              {isImageSelected && (
                <Button variant="contained" color="secondary" onClick={uploadImageToServer}>
                  Upload Image <UploadFile style={{ marginLeft: '0.5rem' }} />
                </Button>
              )}
            </div>

            {errors.uploadImage && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errors.uploadImage}
              </Alert>
            )}

          <LocationSearchInput />
            {errors.geolocation && (
              <Alert severity="error">
              {errors.geolocation}
            </Alert>
          )}

            {/* Username field */}
            <div>
            <SpeechToText onTranscriptChange={setUsername} />
            <p>Click Microphone For Speech To Text</p>
            <TextField
              label="Username"
              variant="outlined"
              color="secondary"
              fullWidth
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: '' });
              }}
              helperText={errors.username}
              error={!!errors.username}
              style={{ color: 'var(--setupBG)', marginBottom: '1rem', marginTop: '1rem' }}
            />
            </div>


            {/* Display Name field */}
            <div>
            <SpeechToText onTranscriptChange={setDisplayName} />
            <p>Click Microphone For Speech To Text</p>
            <TextField
              label="Display Name"
              variant="outlined"
              color="secondary"
              fullWidth
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setErrors({ ...errors, displayName: '' });
              }}
              helperText={errors.displayName}
              error={!!errors.displayName}
              style={{ color: 'var(--setupBG)', marginBottom: '1rem', marginTop: '1rem' }}
            />
            </div>


            {/* Privacy field */}
            <TextField
            select
            label="Privacy"
            variant="outlined"
            color="secondary"
            fullWidth
            value={privacy}
            onChange={e => setPrivacy(e.target.value)}
            style={{ color: 'var(--setupBG)', marginBottom: '1rem' }}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="friends only">Friends Only</MenuItem>
          </TextField>

            {/* Map Icon field */}
            <TextField
              select
              label="Select Map Icon"
              variant="outlined"
              color="secondary"
              fullWidth
              value={selectedMapIcon}
              onChange={(e) => {
                setSelectedMapIcon(e.target.value);
                setErrors({ ...errors, mapIcon: '' });
              }}
              helperText={errors.mapIcon}
              error={!!errors.mapIcon}
              style={{ color: 'var(--setupBG)', marginBottom: '1rem' }}
            >
            <MenuItem value="https://img.icons8.com/?size=512&id=2t0cgXala8a2&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=2t0cgXala8a2&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=WSGHwEwOs25O&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=WSGHwEwOs25O&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=xCLiCEaCIH7B&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=xCLiCEaCIH7B&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=IldxgfyDVjuz&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=IldxgfyDVjuz&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=UB3ruGFlmIRr&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=UB3ruGFlmIRr&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=HFEnXvDe0D4p&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=HFEnXvDe0D4p&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=qWX5b0uTbFHX&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=qWX5b0uTbFHX&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=GuOROHDN3mQt&format=png"><img style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=GuOROHDN3mQt&format=png'/></MenuItem>
            </TextField>

            <TextField
              variant="outlined"
              color="secondary"
              type="date"
              fullWidth
              value={birthday}
              onChange={(e) => {
                setBirthday(e.target.value);
                setErrors({ ...errors, birthday: '' });
              }}
              helperText={errors.birthday}
              error={!!errors.birthday}
              style={{ color: 'var(--setupBG)', marginBottom: '1rem' }}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleBusinessProfile}
              style={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              Create Profile
            </Button>

            {errors.saveProfile && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errors.saveProfile}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default BusinessProfile;


