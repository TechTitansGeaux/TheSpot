/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useEffect, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from 'axios';
import NewEventForm from './NewEventForm';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
// import { LazyMotion, m, domAnimation } from 'framer-motion';
import { useNavigate  } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

type Props = {
  currentEvent: {
    id: number;
    name: string;
    rsvp_count: number;
    date: string;
    time: string;
    endTime: string;
    geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
    address: string,
    twenty_one: boolean;
    isPublic: boolean,
    createdAt: string;
    updatedAt: string;
    PlaceId: number;
  },
  user: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  },
  mustCreateEvent: boolean,
  currentEventId: number,
  updateMustCreateEvent: () => void,
  currentAddress: string,
  friends: {
    id: number;
    status: string;
    requester_id: number;
    accepter_id: number;
  }[];
};

const VideoRecorder: React.FC<Props> = ({
  currentEvent, user, mustCreateEvent, currentEventId, updateMustCreateEvent, currentAddress, friends
}) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [public_id, setPublic_id] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [eventId, setEventId] = useState(0)
  const [justRecorded, setJustRecorded] = useState(false);
  const [reelSaved, setReelSaved] = useState(false);
  const [businessEventCreated, setBusinessEventCreated] = useState(false);
  const [eventIsPublic, setEventIsPublic] = useState(true);
  const [urlRetrieved, setUrlRetrieved] = useState(false);
  const [clear, setClear] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  const [mirrored, setMirrored] = useState(true);
  const [open, setOpen] = useState(false);

  type Blob = {
    data: {
    size: number,
    type: string,
    }
  };
  
  // navigator.mediaDevices.enumerateDevices().then(devices => console.log(devices))

  const handleDataAvailable = useCallback(
    ({ data }: Blob) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

// function to turn ANY url into a file!
const urltoFile = (url: any, filename: any, mimeType: any) => {
  if (url.startsWith('data:')) {
      const arr = url.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[arr.length - 1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], filename, {type:mime || mimeType});
      return Promise.resolve(file);
  }
  return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename,{type:mimeType}));
}

  // when they click start video
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    if (MediaRecorder.isTypeSupported('video/webm')) {
      console.log('webm supported')
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
  } else if (MediaRecorder.isTypeSupported('video/mp4')) {
    console.log('mp4 supported')
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/mp4",
    });
  }
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setTimeout(() => {
      handleStopCaptureClick();
    }, 6000)
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  // when they click to end recording video
  const handleStopCaptureClick = useCallback(async () => {
    await mediaRecorderRef.current.stop();
    setCapturing(false);
    setJustRecorded(true);
  }, [mediaRecorderRef, setCapturing]);


  // upload whenever they are done recording and setJustRecorded is called
  useEffect(() => {
    const upload = async () => {
      // console.log('hit outside of conditional')
      if (recordedChunks.length) {
        // console.log('hit inside conditional')
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        // turn url into blob
        const blobUrl = URL.createObjectURL(blob);
        // turn blobUrl into file
        const file = await urltoFile(blobUrl, 'video.webm', 'video/webm')
        // append file to form data
        const formData = new FormData;

        console.log(file.size, '<------ size of file')

        formData.append('video', file);
        // console.log(file, '<---- file that is appended to formData')
        // send video form data to server

        await axios.post('/reel/upload', formData, {
          maxBodyLength: 10000000,
          maxContentLength: 10000000,
        })
        .then((res) => {
          console.log(res, '<---res from axios upload')
          setPublic_id(res.data.cloudID);
          setUrl(res.data.cloudURL)
          setUrlRetrieved(true)
          setRecordedChunks([]);
        })
        .catch((err) => {
          console.log('Failed axios UPLOAD reel: ', err)
        })
      }
    };
    upload();
  }, [justRecorded, mediaRecorderRef, recordedChunks])

  // get built in 3 hour event default end time
  const defaultEndTime = (Number(currentEvent.time.slice(0, 2)) + 3) + currentEvent.time.slice(2);

  // save reel to databases
  // get all reel properties from predetermined event properties
  const saveReel = async () => {
  // IF the event has to be created
  if (mustCreateEvent === true) {
    console.log('must create event === true hit')
    await axios.post('/events/create', {
        name: currentEvent.name,
        date: currentEvent.date,
        time: currentEvent.time,
        endTime: defaultEndTime,
        geolocation: currentEvent.geolocation,
        address: currentAddress,
        twenty_one: currentEvent.twenty_one,
        isPublic: eventIsPublic,
        UserId: user.id
    })
    .then((res) => {
      // console.log(res, '<----- response from axios post event')
      setEventId(res.data.event.id)
      setReelSaved(true);
    })
    .catch((err) => {
      console.error('Failed axios post event: ', err);
    })
  } else {
    // If event did not need to be created, set event id to the one passed down from props
    if (currentEventId !== 0 && businessEventCreated === false) {
    setEventId(currentEventId);
    }
    setReelSaved(true)
  }
  };

  // console.log(eventId, '<---- eventId in state')

  // POST THE REEL to the db, but only AFTER eventId has been GOT
  const postReelToDb = async () => {
    await axios.post('/reel/post', {
      public_id: public_id,
      url: url,
      text: text,
      userId: user.id,
      EventId: eventId
  })
  .then((resObj) => {
    // console.log(resObj, '<--- response from axios post reel')
        // no longer just recorded
  setJustRecorded(false)
  // reset url
  setUrl('');
  setText('');
  })
  .then(() => {
    redirectToFeed();
  })
  .catch((err) => {
    console.error('Failed axios post reel: ', err);
  })
  }

  // post reel to db should be invoked whenever eventId has been changed
  useEffect(() => {
    if (reelSaved === true) {
      postReelToDb();
      setReelSaved(false);
    }
  }, [eventId, reelSaved])

  const videoConstraints = {
    facingMode: facingMode,
  };

// handle input text for caption
const handleText = (e: any) => {
setText(e.target.value);
};

// navigate to feed if just posted reel
const navigate = useNavigate();

const redirectToFeed = () => {
navigate('/Feed');
}

const clearReel = () => {
  setRecordedChunks([]);
  setPublic_id('');
  setUrl('');
  setText('');
  setJustRecorded(false);
  setUrlRetrieved(false);
  const box = document.getElementById('event-form');
  box.style.display = 'none';
  setClear(true);
  setIsCameraLoading(true);
  handleClose();
}

const resetClear = () => {
  setClear(false);
}

// toggle pop up modal
const togglePopUp = () => {
const box = document.getElementById('event-form')
if (box.style.display === 'block') {
  box.style.display = 'none';
} else {
  box.style.display = 'block';
}
}

// determine user type
const checkUserType = () => {
if (user.type === 'personal') {
  setEventIsPublic(false);
}
}

useEffect(() => {
checkUserType();
}, [])

// set event id from new event form component
const updateEventId = (newId: number) => {
setEventId(newId);
}

const updateBusinessEventCreated = () => {
setBusinessEventCreated(true);
}

const handleCameraLoaded = () => {
  setIsCameraLoading(false);
};

const switchCams = () => {
  setFacingMode(
    prevState =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
  );
  if (mirrored) {
    setMirrored(false)
  } else if (!mirrored) {
    setMirrored(true)
  }
};

  // handle opening delete alert dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  // handle closing delete alert dialog
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div>
      <div className='webContainer'>
      <NewEventForm
      user={user}
      mustCreateEvent={mustCreateEvent}
      updateMustCreateEvent={updateMustCreateEvent}
      updateEventId={updateEventId}
      togglePopUp={togglePopUp}
      updateBusinessEventCreated={updateBusinessEventCreated}
      currentAddress={currentAddress}
      eventIsPublic={eventIsPublic}
      friends={friends}
      clear={clear}
      resetClear={resetClear}/>
        {justRecorded &&
        !urlRetrieved &&
        (

          <div className='webcam'
          style={{paddingTop: '16em'}}>
            <CircularProgress
            size='8rem'
            color='secondary'/>
          </div>
        )}
        { justRecorded && urlRetrieved && (
        <div className='preview-mask'>
          <div className='webcam'>
            <video
            height='110%'
            width='110%'
            src={url}
            controls autoPlay
            loop>
            </video>
            <input
              className='reel-input-caption'
              placeholder='Add caption?'
              value={text}
              onChange={handleText}
              type='text'>
            </input>
          </div>
        </div>
        )}
        { !justRecorded && isCameraLoading && (
          <div className='webcam'
          style={{paddingTop: '20em', zIndex: '1', position: 'absolute'}}>
            <CircularProgress
            size='8rem'
            color='secondary'/>
          </div>
        )}
        { !justRecorded && (
        <div className='cam-mask'>
          {!isCameraLoading && (
            <CameraswitchIcon 
            color='secondary'
            className='camera-switch-icon'
            onClick={switchCams}/>
          )}
          <Webcam
            style={{zIndex: '1'}}
            className='webcam'
            height='100%'
            width='100%'
            audio={true}
            mirrored={mirrored}
            ref={webcamRef}
            videoConstraints={videoConstraints}
            muted={true}
            onUserMedia={handleCameraLoaded}
          />
        </div>
      )}
      </div>
      <div className='cam-buttons-container'>
      <div className='cameraButtons'>
        {capturing && (
          <RadioButtonCheckedIcon
          onClick={handleStopCaptureClick}
          color='secondary'
          sx={{ width: 52, height: 52 }}/>
        )}
        { !capturing && !justRecorded && !isCameraLoading && (
          // <LazyMotion features={domAnimation}>
          //   <m.div
          //   whileHover={{ scale: 1.2 }}
          //   >
              <RadioButtonUncheckedIcon
              onClick={handleStartCaptureClick}
              color='secondary'
              sx={{ width: 52, height: 52 }}/>
          //   </m.div>
          // </LazyMotion>
        )}
        {justRecorded && urlRetrieved && (
          <div>
            <Tooltip
            open={true}
            title='Trash'
            placement='bottom'
            PopperProps={{
              style: {zIndex: '0'},
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: 'transparent',
                  border: 'solid #F5FCFA 1px',
                  color: '#F5FCFA'
                },
              }
            }}
          >
          {/* <LazyMotion features={domAnimation}>
          <m.div
          whileHover={{ scale: 1.2 }}
          > */}
            <DeleteIcon
            onClick={handleClickOpen}
            color='secondary'
            sx={{ width: 52, height: 52 }}/>
          {/* </m.div>
          </LazyMotion> */}
          </Tooltip>
          <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure? "}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this reel?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={clearReel} autoFocus>
                    Yes
                  </Button>
                  <Button onClick={handleClose}>No</Button>
                </DialogActions>
              </Dialog>
          </div>
        )}
          {justRecorded && urlRetrieved && (
          <div>
            <div
            onClick={togglePopUp}>
                <Tooltip
                open={true}
                title='Edit'
                placement='bottom'
                PopperProps={{
                  style: {zIndex: '0'},
                  sx: {
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'transparent',
                      border: 'solid #F5FCFA 1px',
                      color: '#F5FCFA',
                    },
                  },
                }}
                >
                {/* <LazyMotion features={domAnimation}>
                <m.div
                  whileHover={{ scale: 1.2 }}
                  > */}
                    <EventNoteIcon
                    color='secondary'
                    sx={{ width: 52, height: 52 }}/>
                {/* </m.div>
                </LazyMotion> */}
                </Tooltip>
            </div>
          </div>
        )}
        {justRecorded && urlRetrieved && (
          <div>
            <Tooltip
            open={true}
            title='Post'
            placement='bottom'
            PopperProps={{
              style: {zIndex: '0'},
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: 'transparent',
                  border: 'solid #F5FCFA 1px',
                  color: '#F5FCFA',
                },
              },
            }}
          >
          {/* <LazyMotion features={domAnimation}>
          <m.div
          whileHover={{ scale: 1.2 }}
          > */}
            <ArrowCircleRightIcon
            onClick={saveReel}
            color='secondary'
            sx={{ width: 52, height: 52 }}/>
          {/* </m.div>
          </LazyMotion> */}
          </Tooltip>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default VideoRecorder;
