/* eslint-disable @typescript-eslint/no-unused-vars */
 /* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';
import Button from '@mui/material/Button';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
// import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SpeechToText from '../ProfileSetUp/SpeechToText';


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

type Props = {
  handleLocation: (geolocation: any) => void;
  handleAddress: (address: string) => void;
  currentAddress: string;
}

const EventLocationSearch: React.FC<Props> = ({handleLocation, handleAddress, currentAddress}) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const [geolocationError, setGeolocationError] = useState<string>('');
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [geolocation, setGeolocation] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(0);
  const [errors, setErrors] = useState({ address: ''});

  // useEffect(() => {
  //   if (authUser) {
  //     setLocationStatus(`Your geolocation: ${authUser.geolocation}`);
  //   }
  // }, [authUser]);

  const handleSelect = async (selectedAddress: string) => {
    const newErrors = { ...errors };

    if (!address) {
      newErrors.address = 'Address is required.';
    } else {
      newErrors.address = '';
    }

    setErrors(newErrors);

    if (
      newErrors.address
    ) {
      return;
    }

    const results = await geocodeByAddress(selectedAddress);
    const latLng = await getLatLng(results[0]);

    setAddress(selectedAddress);
    const newGeolocation = `${latLng.lat},${latLng.lng}`;
    handleLocation(newGeolocation);
    handleAddress(selectedAddress);
}

  return (
    // <ThemeProvider theme={theme}>
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            {/* <SpeechToText onTranscriptChange={setAddress} />
            <p>Click Microphone For Speech To Text</p> */}
              {/* <TextField
                label="Address"
                variant="outlined"
                color="secondary"
                fullWidth
                {...getInputProps({ placeholder: 'Type address' })}
                helperText={errors.address}
                error={!!errors.address}
                style={{ color: 'var(--setupBG)', marginBottom: '1rem', marginTop: '1rem' }}
              /> */}
              <textarea
              // placeholder={address}
              className='eventDetailInput'
              {...getInputProps({ placeholder: currentAddress })}
              // helperText={errors.address}
              // error={!!errors.address}
              ></textarea>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, index) => {
                  const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                  const style = {
                    backgroundColor:'#0b0113',
                    cursor: 'pointer',
                  };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                      key={index}
                    >
                      <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
    // </ThemeProvider>
  )
}

export default EventLocationSearch;

