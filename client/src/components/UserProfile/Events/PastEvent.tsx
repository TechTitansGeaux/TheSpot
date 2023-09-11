import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

dayjs.extend(localizedFormat)

dayjs().format('L LT')

type Props = {
  event: {
    PlaceId: string,
    UserId: number,
    createdAt: string,
    date: string,
    endTime: string,
    geolocation: string,
    address: string,
    id: number,
    name: string,
    rsvp_count: number,
    time: string,
    twenty_one: boolean,
    isPublic: boolean,
    updatedAt: string
  },
  getMyEvents: () => void,
}
const PastEvent: React.FC<Props> = ({event, getMyEvents}) => {

  const [open, setOpen] = useState(false);
  const [was21, setWas21] = useState('Yes')

  useEffect(() => {
    if (!event.twenty_one) {
      setWas21('No');
    }
  }, [])


  let eventDate = dayjs(event.date + event.time).format('MM/DD/YYYY, h:mm A');
  const eventTime = eventDate.slice(eventDate.indexOf(' '))
  eventDate = eventDate.slice(0, eventDate.indexOf(','));

  const endDate = dayjs(event.date + event.endTime).format('MM/DD/YYYY, h:mm A');
  const eventEndTime = endDate.slice(endDate.indexOf(' '))

    // handle opening delete alert dialog
    const handleClickOpen = () => {
      setOpen(true);
    };
    // handle closing delete alert dialog
    const handleClose = () => {
      setOpen(false);
    };

      // delete event
  const deleteEvent = () => {
    axios.delete(`/events/delete/${event.id}`)
      .then(() => {
        setOpen(false);
        getMyEvents();
      })
      .catch((err) => {
        console.error('Failed to axios delete event: ', err);
      })
  }

  return (
    <div className='column-md-2'>
      <div className='eventCard'>
        <div className='eventCardDetails'>
          <h3 className='eventNameInput'>
            {event.name}
          </h3>
          <br></br>
          Address:
          <div
          className='eventDetailInput'>
          {event.address}
          </div>
          <br></br>
          <br></br>
          Date:&#160;
          <div
          className='eventDetailInput'>
          {eventDate}
          </div>
          <br></br>
          <br></br>
          Began:&#160;
          <div
          className='eventDetailInput'>
          {eventTime}
          </div>
          <br></br>
          <br></br>
          Ended:&#160;
          <div
          className='eventDetailInput'>
          {eventEndTime}
          </div>
          <br></br>
          <br></br>
          RSVPs:&#160;
          <div
          className='eventDetailInput'>
          {event.rsvp_count}
          </div>
          <br></br>
          <br></br>
          21+: &#160;
          <div
          className='eventDetailInput'>
          {was21}
          </div>
          <HighlightOffIcon
              className='delete-event-button'
              onClick={handleClickOpen}
              ></HighlightOffIcon>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure you want to delete this event?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Deleting an event will delete all related reels.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={deleteEvent} autoFocus>
                    Yes
                  </Button>
                  <Button onClick={handleClose}>No, I&#39;ll keep the reels</Button>
                </DialogActions>
              </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PastEvent;
