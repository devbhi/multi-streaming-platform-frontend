import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios"; // Import axios

const socket = io("http://localhost:3000");

function App() {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [keySent, setKeySent] = useState(false);
  const [useId, setUserId] = useState("5825577a-08bc-44e7-aa30-94111e665011");
  const [youtubeKey, setYoutubeKey] = useState(""); // State to store YouTube key

  useEffect(() => {
    const initializeMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      videoRef.current.srcObject = stream;
    };

    initializeMedia().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchYoutubeKey = async () => {
      try {
        const response = await axios.get(
          "https://multi-streaming-platform-backend.vercel.app/keys/youtube",
          {
            params: { userId: useId },
          }
        );
        setYoutubeKey(response.data.youtubeKey);
      } catch (error) {
        console.error("Error fetching YouTube key:", error);
      }
    };

    fetchYoutubeKey();
  }, []);

  const startRecording = () => {
    if (!mediaStream) return;

    const mediaRecorder = new MediaRecorder(mediaStream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (youtubeKey && !keySent) {
        socket.emit("send-key", youtubeKey);
        setKeySent(true);
      }
      if (keySent) {
        if (event.data && event.data.size > 0) {
          console.log("Binary Stream Available", event.data);
          socket.emit("binarystream", event.data);
        }
      }
    };

    mediaRecorder.start(25); // sends data in 25ms chunks
  };

  return (
    <>
      <div>
        <h1>Streamyard Clone</h1>
        <div>
          <video ref={videoRef} autoPlay muted></video>
          <button onClick={startRecording}>Start</button>
        </div>
      </div>
    </>
  );
}

export default App;
