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
import LocationSearchInput from './LocationSearchInput';
import SpeechToText from './SpeechToText'

type Props = {
fontSize: string;
}

const fontSizes = {
  'sm-font': 8,
  'reg-font': 16,
  'md-font': 24,
  'lg-font': 40,
};


const BusinessSettings: React.FC<Props> = ({fontSize}) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const [displayName, setDisplayName] = React.useState('');
  const [picture, setPicture] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState(null||'');
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedMapIcon, setSelectedMapIcon] = React.useState('');
  const [geolocation, setGeolocation] = React.useState('');
  const [privacy, setPrivacy] = React.useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  //const fontSize = useSelector((state: RootState) => state.app.fontSize); // Fetch font size from the Redux store
  const [selectedFont, setSelectedFont] = useState('reg-font'); // Local state to manage the selected font size


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
    try {
      setShowDeleteConfirmation(false);

      // success message
      alert("Account deleted successfully!");

      const response = await axios.delete(`/users/${authUser.id}`);
      if (response && response.data) {
        dispatch(setAuthUser(null));
        window.location.href = `${process.env.HOST}/`;
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (authUser) {
      setPicture(authUser.picture);
      setGeolocation(authUser.geolocation);
    }
  }, [authUser]);

  const handleSettings = () => {

  // if (size === 'var(--sm-font)') {
  //   document.body.style.fontSize = 'var(--sm-font)';
  // } else if (size === 'var(--md-font)') {
  //   document.body.style.fontSize = 'var(--md-font)';
  // } else if (size === 'var(--lg-font)') {
  //   document.body.style.fontSize = 'var(--lg-font)';
  // }

  // Update font size in Redux state
  dispatch(setFontSize(selectedFont));

  //  // Update font size in CSS
  //  document.documentElement.style.fontSize = selectedFont;

    if (geolocation === '') {
      throw new Error("Geolocation is required.");
    }

    const profileData = {
      displayName,
      picture,
      mapIcon: selectedMapIcon,
      privacy,
      geolocation
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

  // const handleDeleteUser = async () => {
  //   try {
  //     const response = await axios.delete(`/users/${authUser.id}`);
  //     if (response && response.data) {
  //       // logout the user by clearing the authUser state
  //       dispatch(setAuthUser(null));
  //       // redirect the user to the homepage
  //       window.location.href = `${process.env.HOST}/`;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleLogout = () => {
    // logout the user by clearing the authUser state
    dispatch(setAuthUser(null));
    // redirect the user to the homepage
    window.location.href = `${process.env.HOST}/`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className={`container-full-w center`}>
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
        <LocationSearchInput />

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
          <MenuItem value="https://img.icons8.com/?size=512&id=rMv4B3bzTLCX&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=rMv4B3bzTLCX&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=GTba5IMgy3gc&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=GTba5IMgy3gc&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=xCLiCEaCIH7B&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=xCLiCEaCIH7B&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=rYCIDB4Eyl3Y&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=rYCIDB4Eyl3Y&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=knkdasdhCwXa&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=knkdasdhCwXa&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=abOoUFblJ-3v&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=abOoUFblJ-3v&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=0My7pGwQmrg4&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=0My7pGwQmrg4&format=png'/></MenuItem>

            <MenuItem value="https://img.icons8.com/?size=512&id=k0o3gBVVzzUr&format=png"><img style={{ width: '40px', height: '40px', marginLeft: '0.5rem' }} src='https://img.icons8.com/?size=512&id=k0o3gBVVzzUr&format=png'/></MenuItem>
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

export default BusinessSettings;
