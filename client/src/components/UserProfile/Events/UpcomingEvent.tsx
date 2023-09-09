  /* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import EventLocationSearch from '../../CreateReel/EventLocationSearch';
import ConflictingEvent from '../../CreateReel/ConflictingEvent';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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
    updatedAt: string
  },
  getMyEvents: () => void,
  user: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string;
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  }
}
const UpcomingEvent: React.FC<Props> = ({event, getMyEvents, user}) => {

  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.geolocation);
  const [address, setAddress] = useState(event.address);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [endTime, setEndTime] = useState(event.endTime);
  const [twentyOne, setTwentyOne] = useState(event.twenty_one)
  const [justSaved, setJustSaved] = useState(false);
  // Alert Dialog 'are you sure you want to delete this EVENT?'
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [noConflicts, setNoConflicts] = useState(true);
  const [conflictingEvent, setConflictingEvent] = useState({
   id: 0,
   name: 'Conflict',
   rsvp_count: 0,
   date: '',
   time: '',
   endTime: '',
   geolocation: '',
   address: '',
   twenty_one: false,
   isPublic: false,
   createdAt: '',
   updatedAt: '',
   PlaceId: 0
 });

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

  // function to set event location
  const handleLocation = (geolocation: any) => {
    setLocation(geolocation)
    setJustSaved(false);
  };

  const handleAddress = (address: any) => {
    setAddress(address)
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
// handle changing to 21 +
const twentyOneYes = () => {
  setTwentyOne(true)
}

const twentyOneNo = () => {
  setTwentyOne(false)
}

  // get all frens
  const getFriendList = () => {
    if (user) {
      if (user.type === 'personal') {
        axios
          .get(`/feed/frens`)
          .then((response) => {
            setFriends(response.data);
          })
          .catch((err) => {
            console.error('Could not GET friends:', err);
          })
      }
    }
  };

// check to see if there are any events happening at users location right now
const eventCheck = (location: any, date: any) => {
  axios.get(`/events/${location}/${date}`)
    .then((resObj) => {
      // response object is event happening at LOCATION/ DATE; must check to see if theres one happening at TIME
      // iterate through LOCATION/ DATE events
      // ok, right now we have a list of ALL events, pub or priv
      // we want: all public events AND private events IF the creator is our friend
      for (let i = 0; i < resObj.data.length; i++) {
        // rule out the current event that we are editing
        if (resObj.data[i].id !== event.id) {
          //determine if any are happening at time PUBLIC
          // if inputed events START TIME is BETWEEN found events START & END times => conflict
          // or
          // if inputed events END TIME is BETWEEN found events START & END times => conflict
          if (time > resObj.data[i].time && time < resObj.data[i].endTime ||
            endTime > resObj.data[i].time && endTime < resObj.data[i].endTime) {
              // determine if public
              if (resObj.data[i].isPublic) {
                setConflictingEvent(resObj.data[i]);
                setNoConflicts(false)
              } else {
                // iterate through friends
                for (let j = 0; j < friends.length; j++) {
                  // determine if found event is that of friends
                  if (friends[j].accepter_id === resObj.data[i].UserId) {
                    setConflictingEvent(resObj.data[i]);
                    setNoConflicts(false)
                  }
                } // or if it is their own event
                if (user.id === resObj.data[i].UserId) {
                  setConflictingEvent(resObj.data[i]);
                  setNoConflicts(false)
                }
              }
          } else {
            setNoConflicts(true)
          }
        }
      }
      if (resObj.data.length === 0) {
        setNoConflicts(true)
      }
    })
    .catch((err) => {
      setNoConflicts(true);
      console.log('No events for this day/location found: ', err)
    })
}

// check for conflicting events when eventDate or location is entered
useEffect(() => {
  getFriendList();
  if (time !== '' && endTime !== '' && date !== '' && location !== '') {
    eventCheck(location, date);
  }
}, [time, endTime, date, location])

  // patch those changes in event in database
  const saveChanges = () => {
    if (noConflicts) {
      axios.patch(`/events/${event.id}`, {
        geolocation: location,
        address: address,
        name: name,
        date: date,
        time: time,
        endTime: endTime,
        twenty_one: twentyOne
      })
      .then(() => {
        setJustSaved(true);
      })
      .catch((err) => {
        console.error('Failed to axios PATCH event: ', err);
      })
    }
  }

  console.log(twentyOne, '<-----21')
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
        <div>
          <textarea
          className='eventNameInput'
          placeholder={name}
          value={name}
          onChange={handleNameChange}>
          </textarea>
          <div className='eventCardDetails'>
            Address:
            <EventLocationSearch
          handleLocation={handleLocation}
          handleAddress={handleAddress}
          currentAddress={address}/>
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
            RSVPs: <div
            className='eventDetailInput'>
            {event.rsvp_count}
              </div>
            <br></br>
            21+ : <button
         onClick={twentyOneYes}
        //  className='twenty-one-button'
         style={{backgroundColor: twentyOne ? '#f433ab' : '#F5FCFA', color: twentyOne ? '#F5FCFA' : '#0b0113', fontWeight: 'normal'}}>
          Yes
         </button>
         &#160;
         <button
         onClick={twentyOneNo}
        //  className='twenty-one-button'
         style={{backgroundColor: twentyOne ? '#F5FCFA' : '#f433ab', color: twentyOne ? '#0b0113' : '#F5FCFA', fontWeight: 'normal'}}>
          No
          </button>
          </div>
          {!noConflicts && (<ConflictingEvent
          conflictingEvent={conflictingEvent}/>)}
          <br></br>
          {!justSaved && noConflicts && <button
            className='save-event-detail-button'
             style={{ cursor: 'pointer'}}
            onClick={saveChanges}>
              Save
            </button>}
            {justSaved &&<button
            className='save-event-success-button'>
              Saved!</button>}
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
