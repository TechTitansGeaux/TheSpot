import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from 'axios';

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

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

  // const handleDownload = useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm",
  //     });
  //     console.log(blob, '<----blob')
  //     const url = URL.createObjectURL(blob);
  //     console.log(url, '<----vid url')
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.href = url;
  //     a.download = "react-webcam-stream-capture.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  // save reel to databases
  const saveReel = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      // create reel data url for axios post
      const reelData = URL.createObjectURL(blob);
      console.log(reelData, '<----reelData')
      // use post route for axios post
      axios.post('/reel', {
          // public_id: 123,
          video: reelData,
          user_id: 1,
          event_id: 1,
          text: "testText",
          like_count: 3
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
    </div>
  );
}

export default VideoRecorder;
