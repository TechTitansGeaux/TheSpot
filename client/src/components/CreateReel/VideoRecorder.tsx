  import React, { useCallback, useRef, useState } from "react";
  import Webcam from "react-webcam";
  import axios from 'axios';
  // import streamifier from 'streamifier';

  const VideoRecorder = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [capturing, setCapturing] = useState(false);
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

    const handleSelfieClick = useCallback(() => {
      // get the screenshot
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      // send image to server
      axios.post('/reel/upload', {videoFile: imageSrc})
        .then(() => {
          setImgSrc(null);
        })
        .catch((err) => {
          console.error('Failed to axios post selfie: ', err)
        })

    }, [webcamRef]);

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

    // const uploadVideoToServer = async () => {
    //   try {
    //     // const blob = new Blob(recordedChunks, {
    //     //   type: "video/webm",
    //     // });
    //     // const formData = new FormData();
    //     // formData.append('video', blob);
  
    //     const response = await axios.post(`/reel/upload/`, {video: recordedChunks});
  
    //     if (response && response.data) {
    //       console.log(response.data, '<-----data from axios upload to server')
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };


    // save reel to databases
    const saveReel = useCallback(async () => {
      console.log(recordedChunks, '<------ recordedChunks')
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const form = new FormData;
        form.append('file', blob);
        console.log(form, '<------ blob form ')

        await axios.post('/reel/upload', {
            videoFile: form
        })
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
        <button onClick={handleSelfieClick}>Selfie</button>
      </div>
    );
  }

  export default VideoRecorder;
