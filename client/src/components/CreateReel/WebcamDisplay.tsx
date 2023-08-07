import * as React from 'react';
import { useRef, useEffect } from 'react';
// import Webcam from "react-webcam";


const WebcamDisplay = () => {
  const webcamRef = useRef(null);

  const getUserCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then((stream) => {
      // attach stream to video tag
      const video = webcamRef.current;

      video.srcObject = stream;

      video.play()
    })
    .catch((err) => {
      console.error('Failed to get user camera: ', err)
    })
  }

  // get access to user camera
  useEffect(() => {
    getUserCamera()
  }, [webcamRef])
  return (
    <video ref={webcamRef}></video>
  )
};

export default WebcamDisplay;
