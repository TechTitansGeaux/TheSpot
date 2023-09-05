/* eslint-disable @typescript-eslint/no-unused-vars */
 /* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

type Props = {
  handleLocation: (geolocation: any) => void;
  handleAddress: (address: string) => void;
  currentAddress: string;
}

const EventLocationSearch: React.FC<Props> = ({handleLocation, handleAddress, currentAddress}) => {
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({ address: ''});

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
  <div>
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
            <textarea
            className='eventDetailInput'
            {...getInputProps({ placeholder: currentAddress })}
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
  )
}

export default EventLocationSearch;

