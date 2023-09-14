/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';
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
import SpeechToText from '../ProfileSetUp/SpeechToText'


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


const ProfileSetUp: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [picture, setPicture] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedMapIcon, setSelectedMapIcon] = useState('');
  const [geolocation, setGeolocation] = useState('');
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

  const handleProfileSetup = async () => {
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


    // Check if the username already exists in the database
    const allUsers = await axios.get('/users/');

    if (allUsers.data.some((user: { username: string; }) => user.username === username)) {
    // Username already exists, suggest a new username
    const suggestedUsername = generateSuggestedUsername(username);
    newErrors.username = `Username already exists. Try '${suggestedUsername}' or choose a different one.`;
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
      birthday,
      picture,
      mapIcon: selectedMapIcon,
      geolocation,
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

  // Function to generate a suggested username based on the original username and a random number
  const generateSuggestedUsername = (originalUsername: string) => {
    let suggestedUsername = originalUsername;
    const counter = Math.floor(Math.random());


    suggestedUsername = `${originalUsername}_${counter}`;

    return suggestedUsername;
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

  return (
    <ThemeProvider theme={theme}>
      <Container className="container-full-w center">
        <h1>User Profile Setup</h1>
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

            {/* Username field */}
            <p>Click Microphone For Speech To Text</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <SpeechToText onTranscriptChange={setUsername} />
            </div>


            {/* Display Name field */}
            <div style={{ display: 'flex', alignItems: 'center',  }}>
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
              style={{ color: 'var(--setupBG)', marginBottom: '1rem'}}
            />
            <SpeechToText onTranscriptChange={setDisplayName} />
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
            <MenuItem value="https://img.icons8.com/?size=512&id=qzpodiwSoTXX&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=qzpodiwSoTXX&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=20880&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=20880&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=58781&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=58781&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=32002&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=32002&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=35183&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=35183&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=78491&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=78491&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=luN7421eTXGW&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=luN7421eTXGW&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=77988&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=77988&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=juRF5DiUGr4p&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=juRF5DiUGr4p&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=21731&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=21731&format=png'/></MenuItem>
            <MenuItem value="https://img.icons8.com/?size=512&id=rn0oscjrJY2d&format=png"><img style={{ width: '18px', height: '18px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=rn0oscjrJY2d&format=png'/></MenuItem>
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
              onClick={handleProfileSetup}
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

export default ProfileSetUp;


