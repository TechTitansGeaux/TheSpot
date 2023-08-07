import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
// import Webcam from "react-webcam";



const WebcamDisplay = () => {
  const webcamRef = useRef(null);

  // function to get user camera
  const getUserCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
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

  // function to record video
  const recordVideo = () => {

  }
  return (
    <div>
      <video className="webcam" ref={webcamRef}></video>
      <button onClick={recordVideo}>⏺️</button>
    </div>
  )
};

export default WebcamDisplay;
