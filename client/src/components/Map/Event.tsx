import React, { useState, useEffect } from 'react';
import { Button, Popover } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


type Props = {
  event: {
    id: number,
    name: string,
    rsvp_count: number,
    geolocation: string,
    twenty_one: boolean,
    PlaceId: number,
  }
  lat: number
  lng: number
}

const addFriendTheme = createTheme({
  palette: {
    primary: {
      main: '#F0F465', // yellow
      contrastText: '#0B0113',
    }
  },
  shape: {
    borderRadius: 100
  }
});


const Event: React.FC<Props> = ({ event }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  return (
    <div className='event' >
      <ThemeProvider theme={addFriendTheme} >
        <Button style={{ maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px', transform: 'translate(-50%, -50%)' }} aria-describedby={id} variant="contained" onClick={handleClick}>{ event.rsvp_count }</Button>
      </ThemeProvider>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ height: '300px', width: '200px', border: 'solid #f0f465', borderWidth: '4px', borderRadius: '15px', backgroundColor: '#0b0113' }}></div>
      </Popover>
    </div>
  )
}

export default Event;
