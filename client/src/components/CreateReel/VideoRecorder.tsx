  /* eslint-disable @typescript-eslint/no-explicit-any */
  import React, { useCallback, useRef, useState } from "react";
  import Webcam from "react-webcam";
  import axios from 'axios';
  // import streamifier from 'streamifier';

  const VideoRecorder = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [selfieTaken, setSelfieTaken] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [bufferedBlob, setBufferedBlob] = useState({'key': 'value'});

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
        console.log(data, '<----data')
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
    // console.log(imgSrc, '<----imgSrc outside selfie')

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

    const handleStopCaptureClick = useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }, [mediaRecorderRef, setCapturing]);

    const handleDownload = useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const file = new File(recordedChunks, 'video');
        console.log(file, '<---file')
        console.log(blob, '<----blob')
        const url = URL.createObjectURL(blob);
        console.log(url, '<----vid url')
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        console.log(a, '<----a')
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
    }, [recordedChunks]);

    // save reel to databases
    const saveReel = useCallback(async () => {
      console.log(recordedChunks, '<------ recordedChunks')
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        // console.log(blob, '<-----video blob')
        // console.log(blob, '<-----video blob type')
        const blobUrl = URL.createObjectURL(blob);

        const file = await urltoFile(blobUrl, 'video.webm', 'video/webm')
        console.log(file, '<----file')
        const formData = new FormData;
        formData.append('video', file);
        console.log(formData, '<------ blob form ')

        await axios.post('/reel/upload', formData)
        .then(() => {
          setRecordedChunks([]);
        })
        .catch((err) => {
          console.log('Failed axios POST reel: ', err)
        })
      }
    }, [recordedChunks]);

    const videoConstraints = {
      width: 420,
      height: 420,
      facingMode: "user",
    };

    return (
      <div className="Container">
        <Webcam
          height={400}
          width={400}
          audio={false}
          mirrored={true}
          ref={webcamRef}
          videoConstraints={videoConstraints}
        />
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {recordedChunks.length > 0 && (
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
