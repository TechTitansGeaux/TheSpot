import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs = require('dayjs');
dayjs.extend(localizedFormat);
import RsvpSharpIcon from '@mui/icons-material/RsvpSharp';
import { Marker, useMap } from 'react-map-gl';

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
  latitude: number
  longitude: number
  i: number
  // closeAllPopUps: () => void
  // zoom: number
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

const Event: React.FC<Props> = ({ event, latitude, longitude, i }) => {
  const togglePopUp = () => {
    const box = document.getElementById('popUp' + event.name + event.id)
    if (box.style.display === 'block') {
      box.style.animationName = 'popOff';
      setTimeout(() => {
        box.style.display = 'none';
      }, 500)
    } else {
      box.style.animationName = 'popOut';
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
    <Marker latitude={latitude} longitude={longitude} key={'eventPin' + i} anchor='top'>
        <div className='eventDot' id={event.name + event.id} onClick={ () => {
          togglePopUp();
        }}>
          <div >
            <RsvpSharpIcon style={{ transform: 'scale(1.25)' }} color='secondary' />
          </div>
          <div style={{ transform: 'translateY(-10px)' }}>
            { event.rsvp_count }
          </div>
        </div>
        <div className='eventPopUp' id={'popUp' + event.name + event.id} >
          <div style={{ textAlign: 'center', fontSize:'20px', marginTop: '5px' }}>
            {event.name}
          </div>
          <div style={{ textAlign: 'center', fontSize:'15px' }}>
            <p>
              {`date: ${dayjs(event.date).format('L')}`}
            </p>
          </div>
          <div style={{ textAlign: 'center', fontSize:'15px' }}>
            <p>
              {`starts: ${format(event.time)}`}
            </p>
          </div>
          <div style={{ textAlign: 'center', fontSize:'15px' }}>
            <p>
              {`ends: ${format(event.endTime)}`}
            </p>
          </div>
          {
            event.twenty_one && <div style={{ textAlign: 'center', fontSize:'15px' }}>21+</div>
          }
          <div className='zoomToEvent'>
            <div>
              <div style={{ position: 'relative', top: '30px', left: '60px', fontSize: '15px' }}>zoom to event</div>
              <ThemeProvider theme={zoomToEventTheme}>
                <div>
                  <Box>
                    <Fab
                      size='small'
                      color='primary'
                      aria-label='add'
                      className='friend-add-btn'
                    >
                      {/* <ZoomInIcon onClick={ () => {
                        console.log(lat, lng);
                        setZoom(18);
                        setCenter({lat: lat, lng: lng});
                      } } /> */}
                    </Fab>
                  </Box>
                </div>
              </ThemeProvider>
            </div>
          </div>
        </div>
    </Marker>
  )
}

export default Event;
