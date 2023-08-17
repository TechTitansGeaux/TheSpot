  /* eslint-disable @typescript-eslint/no-explicit-any */
  import * as React from 'react';
  import { useEffect, useCallback, useRef, useState } from "react";
  import Webcam from "react-webcam";
  import axios from 'axios';
  import NewEventForm from './NewEventForm';
  import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
  import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
  import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
  import { motion } from 'framer-motion';
  import { useNavigate  } from 'react-router-dom';
  import Tooltip from '@mui/material/Tooltip';
  import EventNoteIcon from '@mui/icons-material/EventNote';
// import { current } from '@reduxjs/toolkit';
  // import dayjs = require('dayjs');
  // import localizedFormat from 'dayjs/plugin/localizedFormat';
  // dayjs.extend(localizedFormat)

  type Props = {
    currentEvent: {
      id: number;
      name: string;
      rsvp_count: number;
      date: Date;
      geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
      twenty_one: boolean;
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
    currentEventId: number
  };

  const VideoRecorder: React.FC<Props> = ({currentEvent, user, mustCreateEvent, currentEventId}) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [public_id, setPublic_id] = useState('');
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [eventId, setEventId] = useState(0)
    const [event, setEvent] = useState({
      id: 0,
      name: '',
      rsvp_count: 0,
      date: new Date,
      geolocation: '',
      twenty_one: false,
      createdAt: '',
      updatedAt: '',
      PlaceId: 0,
    });
    const [justRecorded, setJustRecorded] = useState(false);
    const [reelSaved, setReelSaved] = useState(false);

    type Blob = {
      data: {
      size: number,
      type: string,
      }
    };
    

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
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

    // when they click to end recording video
    const handleStopCaptureClick = useCallback(async () => {
      await mediaRecorderRef.current.stop();
      // setTimeout(() => upload(), 5000);
      setCapturing(false);
      setJustRecorded(true);
    }, [mediaRecorderRef, setCapturing]);

    // upload whenever they are done recording and setJustRecorded is called
    useEffect(() => {
      const upload = async () => {
        console.log('hit outside of conditional')
        if (recordedChunks.length) {
          console.log('hit inside conditional')
          const blob = new Blob(recordedChunks, {
            type: "video/webm",
          });
          // turn url into blob
          const blobUrl = URL.createObjectURL(blob);
          // turn blobUrl into file
          const file = await urltoFile(blobUrl, 'video.webm', 'video/webm') 
          // append file to form data
          const formData = new FormData;
  
          formData.append('video', file);
          // console.log(file, '<---- file that is appended to formData')
          // send video form data to server
          await axios.post('/reel/upload', formData)
          .then(({data}) => {
            // console.log(data, '<---data from axios upload')
            setPublic_id(data.cloudID);
            setUrl(data.cloudURL)
            setRecordedChunks([]);
          })
          .catch((err) => {
            console.log('Failed axios UPLOAD reel: ', err)
          })
        }
      };
      upload();
    }, [justRecorded, mediaRecorderRef, recordedChunks])
    // console.log(recordedChunks, '<-----recorded chunks OUTSIDE')

    // console.log(mustCreateEvent, '<-----must create event outside')

    // save reel to databases
    // get all reel properties from predetermined event properties
    const saveReel = async () => {
    // IF the event has to be created
    if (mustCreateEvent === true) {
      console.log('must create event === true hit')
      await axios.post('/events/create', {
          name: currentEvent.name,
          date: currentEvent.date,
          geolocation: currentEvent.geolocation,
          twenty_one: currentEvent.twenty_one
      })
      .then((res) => {
        // console.log(res, '<----- response from axios post event')
        setEventId(res.data.event.id)
      })
      .catch((err) => {
        console.error('Failed axios post event: ', err);
      })
    } else {
      // If event did not need to be created, set event id to the one passed down from props
      setEventId(currentEventId);
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
      console.log(resObj, '<--- response from axios post reel')
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
    // // no longer just recorded
    // setJustRecorded(false)
    // // reset url
    // setUrl('');
    // setText('');
    }

    // post reel to db should be invoked whenever eventId has been changed
    useEffect(() => {
      if (reelSaved === true) {
        postReelToDb();
        setReelSaved(false);
      }
    }, [eventId])

    const videoConstraints = {
      // width: 420,
      // height: 420,
      facingMode: "user",
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

// toggle pop up modal
const togglePopUp = () => {
  const box = document.getElementById('event-form')
  if (box.style.display === 'block') {
    box.style.display = 'none';
  } else {
    box.style.display = 'block';
  }
}

    return (
      <div>
        <div className='webContainer'>
        <NewEventForm />
          { justRecorded ? (
          <div className='preview-mask'>
            <div className='webcam'>
              <video
              height={780}
              width={730}
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
        ) : (
          <div className='cam-mask'>
            <Webcam
              className='webcam'
              height={700}
              width={700}
              audio={false}
              mirrored={false}
              ref={webcamRef}
              videoConstraints={videoConstraints}
            />
          </div>
        )}
        </div>
        <div className='cam-buttons-container'>
        <div className='cameraButtons'>
          {capturing ? (
            <RadioButtonCheckedIcon
            onClick={handleStopCaptureClick}
            color='secondary'
            sx={{ width: 52, height: 52 }}/>
          ) : (
            <motion.div
            whileHover={{ scale: 1.2 }}
            >
              <RadioButtonUncheckedIcon
              onClick={handleStartCaptureClick}
              color='secondary'
              sx={{ width: 52, height: 52 }}/>
            </motion.div>
          )}
          {justRecorded && (
            <div>
              <Tooltip
              title='Post reel'
              placement='top'
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'transparent',
                    border: 'solid #F5FCFA 1px',
                    color: '#F5FCFA',
                  },
                },
              }}
            >
            <motion.div
            whileHover={{ scale: 1.2 }}
            >
              <ArrowCircleRightIcon
              onClick={saveReel}
              color='secondary'
              sx={{ width: 52, height: 52 }}/>
            </motion.div>
            </Tooltip>
            </div>
          )}
          {justRecorded && (
            <div>
              <div
              onClick={togglePopUp}>
                  <Tooltip
                  title='Add event details'
                  placement='top'
                  PopperProps={{
                    sx: {
                      '& .MuiTooltip-tooltip': {
                        backgroundColor: 'transparent',
                        border: 'solid #F5FCFA 1px',
                        color: '#F5FCFA',
                      },
                    },
                  }}
                  >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    >
                      <EventNoteIcon
                      color='secondary'
                      sx={{ width: 52, height: 52 }}/>
                  </motion.div>
                  </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }

  export default VideoRecorder;
