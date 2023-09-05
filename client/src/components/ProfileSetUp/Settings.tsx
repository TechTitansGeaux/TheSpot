/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser, setFontSize } from '../../store/appSlice';
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
import Location from './Location';
import SpeechToText from '../ProfileSetUp/SpeechToText'



type Props = {
fontSize: string;
startWatch: () => void;
}


const fontSizes = {
  'sm-font': 8,
  'reg-font': 16,
  'md-font': 24,
  'lg-font': 40,
};


const Settings: React.FC<Props> = ({fontSize, startWatch}) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFont, setSelectedFont] = useState(fontSize);

  useEffect(() => {
    if (authUser) {
      setPicture(authUser.picture);
      setGeolocation(authUser.geolocation);
    }
  }, [authUser]);

  // Initialize state variables with existing user data
  const [username, setUsername] = React.useState(authUser.username);
  const [displayName, setDisplayName] = React.useState(authUser.displayName);
  const [picture, setPicture] = React.useState(authUser.picture);
  const [selectedMapIcon, setSelectedMapIcon] = React.useState(authUser.mapIcon);
  const [geolocation, setGeolocation] = React.useState(authUser.geolocation);
  const [privacy, setPrivacy] = React.useState(authUser.privacy);
  const [type, setType] = React.useState(authUser.type);

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
    typography: {
      fontSize: fontSizes[selectedFont as keyof typeof fontSizes], // Set the selected font size here
    },
  });

  useEffect(() => {
    setSelectedFont(fontSize); // Set the selected font size when the component mounts
  }, [fontSize]);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };


  const handleDeleteConfirm = async () => {
      // setShowDeleteConfirmation(false);
      // setUsername(`user${Math.floor(Math.random())}`);
      // setDisplayName(`user${Math.floor(Math.random())}`);
      // setGeolocation('-24.4879217, -46.6741555');
      // setPrivacy('private');
      // setPicture('no pic');
      // setSelectedMapIcon('no icon');
      // setType('');

      // const profileData = {
      //   username: username,
      //   displayName: displayName,
      //   picture: picture,
      //   mapIcon: selectedMapIcon,
      //   geolocation: geolocation,
      //   privacy: privacy,
      //   type: type
      // };
    try {
        // logout the user by clearing the authUser state
        dispatch(setAuthUser(null));
      const response = await axios.delete(`/users/${authUser.id}`);
      if (response && response.data) {
        // redirect the user to the homepage
        window.location.href = process.env.HOST;
      }
    } catch (error) {
      console.error(error);
    }
};

  const handleSettings = () => {

  // Update font size in Redux state
  dispatch(setFontSize(selectedFont));

    if (geolocation === '') {
      throw new Error("Geolocation is required.");
    }

    const profileData = {
      displayName,
      picture,
      mapIcon: selectedMapIcon,
      privacy
    };

    // Update user's profile on the server using Axios
    axios
      .patch(`/users/${authUser.id}`, profileData)
      .then(response => {
        // Dispatch the updated user object to the Redux store
        dispatch(setAuthUser(response.data));
        // redirect the user to the feed
    window.location.href = `${process.env.HOST}/Feed`;
      })
      .catch(error => {
        console.error(error);
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
        console.log(picture, '<-----------PIC');
        setSelectedImage(null||''); // clear the selected image after successful upload
        setIsImageSelected(false); // reset the image selection state
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // logout the user by clearing the authUser state
    dispatch(setAuthUser(null));
    // redirect the user to the homepage
    window.location.href = `${process.env.HOST}/`;
  };

  if (!authUser) {
    // Handle the case when authUser is null, e.g., show a loading spinner
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container className="container-full-w center">
      <h1>Settings</h1>
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
        <Location startWatch={startWatch} />

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
              }}
              style={{ color: 'var(--setupBG)', marginBottom: '1rem', marginTop: '1rem' }}
            />
            </div>


        <TextField
          select
          label="Choose New Map Icon"
          variant="outlined"
          color="secondary"
          fullWidth
          value={selectedMapIcon}
          onChange={e => setSelectedMapIcon(e.target.value)}
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
            select
            label="Update Privacy Setting"
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

          <TextField
            select
            label="Change Font Size"
            variant="outlined"
            color="secondary"
            fullWidth
            value={selectedFont}
            onChange={e => setSelectedFont(e.target.value)}
            style={{ color: 'var(--setupBG)', marginBottom: '1rem' }}
          >
            <MenuItem value='sm-font'>Small</MenuItem>
            <MenuItem value='reg-font'>Regular</MenuItem>
            <MenuItem value='md-font'>Medium</MenuItem>
            <MenuItem value='lg-font'>Large</MenuItem>
          </TextField>


              <Button
              variant="contained"
              color="secondary"
              onClick={handleSettings}
              style={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              Save Profile
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDeleteConfirmation}
                  >
                Delete Account
              </Button>
            </div>
            {showDeleteConfirmation && (
        <div className="footer">
          <p style={{ marginBottom: '1rem' }} >Are you sure you want to delete your account?</p>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteConfirm}
          >
            Yes, Delete
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteCancel}
          >
            Cancel
          </Button>
        </div>
      )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default Settings;
