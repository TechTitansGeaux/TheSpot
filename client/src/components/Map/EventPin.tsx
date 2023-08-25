import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs = require('dayjs');
dayjs.extend(localizedFormat);

type Props = {
  event: {
    id: number,
    name: string,
    rsvp_count: number,
    date: string,
    time: string,
    endTime: string
    geolocation: string,
    twenty_one: boolean,
    PlaceId: number,
  }
  lat: number
  lng: number
  setZoom: (zoom: number) => void
  setCenter: (center: object) => void
  closeAllPopUps: () => void
  zoom: number
}

const zoomToEventTheme = createTheme({
  palette: {
    primary: {
      main: '#F0F465', // yellow
      dark: '#4CBB17', // green
      contrastText: '#0B0113',
    },
    secondary: {
      main: '#F0F465',
      dark: '#4CBB17',
      contrastText: '#0B0113',
    },
  },
});



const Event: React.FC<Props> = ({ event, setCenter, setZoom, lat, lng, zoom }) => {
  const togglePopUp = () => {
    const box = document.getElementById('popUp' + event.name + event.id)
    if (box.style.display === 'block') {
      box.style.display = 'none';
    } else {
      box.style.display = 'block';
    }
  }

  const format = (time: string) => {
    const [hour, min] = time.split(':');
    if (+hour > 12) {
      return `${+hour - 12}:${min} PM`;
    } else {
      return time + ' AM';
    }
  };

  return (
    <div>
      <div className='eventDot' id={event.name + event.id} onClick={ () => {
        if (zoom < 15) {
          setZoom(15);
          setCenter({lat: lat - 0.005, lng: lng});
        } else {
          setCenter({lat: lat - (0.005 / ( 2 ** (zoom - 15))), lng: lng});
        }
        togglePopUp();
      }}>
        <div style={{ marginTop: '12.5px', fontSize: '20px', color: 'black' }}>
          {event.rsvp_count}
        </div>
      </div>
      <div className='eventPopUp' id={'popUp' + event.name + event.id} >
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          {event.name}
        </div>
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          <p>
            {`RSVP's: ${event.rsvp_count}`}
          </p>
        </div>
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          <p>
            {`date: ${dayjs(event.date).format('L')}`}
          </p>
        </div>
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          <p>
            {`starts: ${format(event.time)}`}
          </p>
        </div>
        <div style={{ textAlign: 'center', fontSize:'20px' }}>
          <p>
            {`ends: ${format(event.endTime)}`}
          </p>
        </div>
        <div className='zoomToEvent'>
          <div>
            <div style={{ position: 'relative', top: '27.5px', left: '60px' }}>zoom to event</div>
            <ThemeProvider theme={zoomToEventTheme}>
              <div>
                <Box>
                  <Fab
                    size='small'
                    color='primary'
                    aria-label='add'
                    className='friend-add-btn'
                  >
                    <ZoomInIcon onClick={ () => {
                      console.log(lat, lng);
                      setZoom(18);
                      setCenter({lat: lat, lng: lng});
                     } } />
                  </Fab>
                </Box>
              </div>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Event;
