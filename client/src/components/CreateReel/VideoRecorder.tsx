  /* eslint-disable @typescript-eslint/no-explicit-any */
  import * as React from 'react';
  import { useEffect, useCallback, useRef, useState } from "react";
  import Webcam from "react-webcam";
  import axios from 'axios';
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
    mustCreateEvent: boolean
  };

  const VideoRecorder: React.FC<Props> = ({currentEvent, user, mustCreateEvent}) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [selfieTaken, setSelfieTaken] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [public_id, setPublic_id] = useState('');
    const [url, setUrl] = useState('');
    const [text, setText] = useState('test text');
    const [eventId, setEventId] = useState(0)
    const [reelId, setReelId] = useState(0);
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

    // function to turn image data string into file
  const dataURLtoFile = (dataurl: any, filename: any) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
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

    // to enable selfies, must got back and make server route with upload.image to multer (rather than video)
    const handleSelfieClick = useCallback(async () => {
      setSelfieTaken(true);
      // get the screenshot
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }, [webcamRef]);

    // this would be attached to a post button for pics, if we choose to let them post pics
    const handleSaveSelfie = useCallback(() => {
      // try to turn long string into a file
      const file = dataURLtoFile(imgSrc, 'image.jpg');

      const formData = new FormData();
      formData.append('image', file);
      // send image to server
      axios.post('/reel/upload', formData)
        .then(() => {
          setImgSrc(null);
        })
        .catch((err) => {
          console.error('Failed to axios post selfie: ', err)
        })
        setSelfieTaken(false);
    }, [selfieTaken])

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
            console.log(data, '<---data from axios upload')
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
    console.log(recordedChunks, '<-----recorded chunks OUTSIDE')

    const handleDownload = useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
    }, [recordedChunks]);

    console.log(mustCreateEvent, '<-----must create event outside')
    // save reel to databases
    // get all reel properties from predetermined event properties
    const saveReel = async () => {
    // IF the event has to be created
    if (mustCreateEvent === true) {
      console.log('must create event === true hit')
      await axios.post('/events/create', {
          name: currentEvent.name,
          rsvp_count: 0,
          date: currentEvent.date,
          geolocation: currentEvent.geolocation,
          twenty_one: currentEvent.twenty_one
      })
      .then((res) => {
        console.log(res, '<----- response from axios post event')
        setEventId(res.data.event.id)
      })
      .catch((err) => {
        console.error('Failed axios post event: ', err);
      })
      axios.post('/reel/post', {
        public_id: public_id,
        url: url,
        text: text,
        like_count: 0,
        userId: user.id,
        eventId: eventId
    })
    .then((resObj) => {
      console.log(resObj, '<--- response from axios post reel')
    })
    .catch((err) => {
      console.error('Failed axios post reel: ', err);
    })
    }
    // no longer just recorded
    setJustRecorded(false)
    // reset url
    setUrl('');
    };

    const videoConstraints = {
      width: 420,
      height: 420,
      facingMode: "user",
    };
console.log(url, '<-----url')
    return (
      <div className="Container"> { justRecorded ? (
        <video
        height={400}
        width={400}
        src={url}
        controls autoPlay
        loop>
        </video>
      ) : (
        <Webcam
          height={400}
          width={400}
          audio={false}
          mirrored={true}
          ref={webcamRef}
          videoConstraints={videoConstraints}
        /> 
      )}
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {justRecorded && (
          <button onClick={saveReel}>Post</button>
        )}
        {/* {selfieTaken ? (
        <button onClick={handleSaveSelfie}>Save Selfie</button>
      ) : (
        <button onClick={handleSelfieClick}>Take Selfie</button>
      )} */}
      </div>
    );
  }

  export default VideoRecorder;
