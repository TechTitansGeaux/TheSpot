  /* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

type Props = {
  event: {
    PlaceId: string,
    UserId: number,
    createdAt: string,
    date: string,
    endTime: string,
    geolocation: string,
    id: number,
    name: string,
    rsvp_count: number,
    time: string,
    twenty_one: boolean,
    updatedAt: string
  }
}
const UpcomingEvent: React.FC<Props> = ({event}) => {

  const [name, setName] = useState(event.name);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [endTime, setEndTime] = useState(event.endTime);
  const [twentyOne, setTwentyOne] = useState(event.twenty_one)
  const [justSaved, setJustSaved] = useState(false);
  // Alert Dialog 'are you sure you want to delete this EVENT?'
  const [open, setOpen] = useState(false);

  // handle opening delete alert dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  // handle closing delete alert dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value);
    setJustSaved(false);
  }

  const handleDateChange = (e: any) => {
    setDate(e.target.value);
    setJustSaved(false);
  }
  const handleTimeChange = (e: any) => {
    setTime(e.target.value);
    setJustSaved(false);
  }
  const handleEndTimeChange = (e: any) => {
    setEndTime(e.target.value);
    setJustSaved(false);
  }
  const handleTwentyOneChange = (e: any) => {
    setTwentyOne(e.target.value);
    setJustSaved(false);
  }


  // patch those changes in event in database
  const saveChanges = () => {
    axios.patch(`/events/${event.id}`, {
      name: name,
      date: date,
      time: time,
      endTime: endTime
    })
    .then(() => {
      setJustSaved(true);
    })
    .catch((err) => {
      console.error('Failed to axios PATCH event: ', err);
    })
  }

  // delete event
  const deleteEvent = () => {
    axios.delete(`/events/delete/${event.id}`)
      .catch((err) => {
        console.error('Failed to axios delete event: ', err);
      })
  }
  return (
    <div className='column-md-2'>
      <div className='eventCard'>
        <div>
          <input
          className='eventNameInput'
          placeholder={name}
          value={name}
          onChange={handleNameChange}
          type='text'>
          </input>
          <div className='eventCardDetails'>
            <br></br>
            Date:
            <input
            className='eventDetailInput'
            placeholder={date}
            value={date}
            onChange={handleDateChange}
            type='date'
            ></input>
            <br></br>
            Begins:
            <input
            className='eventDetailInput'
            placeholder={time}
            value={time}
            onChange={handleTimeChange}
            type='time'
            ></input>
            <br></br>
            Ends:
            <input
            className='eventDetailInput'
            placeholder={endTime}
            value={endTime}
            onChange={handleEndTimeChange}
            type='time'
            ></input>
            <br></br>
            RSVPs: {event.rsvp_count}
            <br></br>
            {event.twenty_one && '21+'}
            <br></br>
            <br></br>
          </div>
          {!justSaved && <button
            className='save-event-detail-button'
             style={{ cursor: 'pointer'}}
            onClick={saveChanges}>
              Save
            </button>}
            {justSaved && <button
            className='save-event-success-button'>
              Saved!</button>}
              <button
              className='delete-event-button'
              onClick={handleClickOpen}>
                X
              </button>
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
                    Only delete events that are fully cancelled. Deleting an event will
                    delete all related reels. Keep your hype for a rescheduled event by
                    editing the date or time.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={deleteEvent} autoFocus>
                    Yes, event is cancelled
                  </Button>
                  <Button onClick={handleClose}>I&#39;ll reschedule</Button>
                </DialogActions>
              </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
