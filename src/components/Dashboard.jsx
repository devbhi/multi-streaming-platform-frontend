import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { authService } from "../services/authService";
import { LogOut, Play, Square, Users, Eye, Clock } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import PlatformButtons from "./PlatformButtons";
import axios from "axios";

// Socket connections for different platforms
const SOCKET_URLS = {
  YouTube: "http://localhost:3000",
  Twitch: "http://localhost:5500",
  Facebook: "http://localhost:6001",
};

const Dashboard = ({ user, onLogout }) => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [twitchKey, setTwitchKey] = useState("");
  const [facebookKey, setFacebookKey] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [useId] = useState("5825577a-08bc-44e7-aa30-94111e665011");

  // Multi-platform streaming state
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [connectedSockets, setConnectedSockets] = useState({});
  const [keysSent, setKeysSent] = useState({});

  // Default dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalStreams: 12,
    liveViewers: 245,
    streamDuration: "02:34:15",
    platforms: [
      { name: "YouTube", status: "connected", viewers: 156 },
      { name: "Twitch", status: "connected", viewers: 89 },
      { name: "Facebook", status: "disconnected", viewers: 0 },
    ],
    recentStreams: [
      {
        title: "Gaming Session #5",
        date: "2024-01-15",
        duration: "3h 45m",
        viewers: 234,
      },
      {
        title: "Tech Talk",
        date: "2024-01-14",
        duration: "1h 20m",
        viewers: 156,
      },
      {
        title: "Q&A Session",
        date: "2024-01-13",
        duration: "2h 10m",
        viewers: 189,
      },
    ],
  });

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMedia();
  }, []);

  useEffect(() => {
    const fetchPlatformKeys = async () => {
      try {
        // Fetch YouTube key
        const youtubeResponse = await axios.get(
          "https://multi-streaming-platform-backend.vercel.app/keys/youtube",
          { params: { userId: useId } }
        );
        if (youtubeResponse.data.youtubeKey) {
          setYoutubeKey(youtubeResponse.data.youtubeKey);
        }

        // Fetch Twitch key
        const twitchResponse = await axios.get(
          "https://multi-streaming-platform-backend.vercel.app/keys/twitch",
          { params: { userId: useId } }
        );
        if (twitchResponse.data.twitchKey) {
          setTwitchKey(twitchResponse.data.twitchKey);
        }

        // Fetch Facebook key
        const facebookResponse = await axios.get(
          "https://multi-streaming-platform-backend.vercel.app/keys/facebook",
          { params: { userId: useId } }
        );
        if (facebookResponse.data.facebookKey) {
          setFacebookKey(facebookResponse.data.facebookKey);
        }
      } catch (error) {
        console.error("Error fetching platform keys:", error);
      }
    };

    fetchPlatformKeys();
  }, [useId]);

  // Cleanup sockets on component unmount
  useEffect(() => {
    return () => {
      disconnectSockets();
    };
  }, []);

  // useEffect(() => {
  //   const fetchYoutubeKey = async () => {
  //     try {
  //       const result = await authService.getYouTubeKey(user.id);
  //       if (result.success) {
  //         setYoutubeKey(result.youtubeKey);
  //       } else {
  //         console.error("Error fetching YouTube key:", result.error);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching YouTube key:", error);
  //     }
  //   };

  //   fetchYoutubeKey();
  // }, [user.id]);

  // Helper function to get platform keys
  const getPlatformKey = (platform) => {
    switch (platform) {
      case "YouTube":
        return youtubeKey;
      case "Twitch":
        return twitchKey;
      case "Facebook":
        return facebookKey;
      default:
        return "";
    }
  };

  // Disconnect from all sockets
  const disconnectSockets = () => {
    Object.values(connectedSockets).forEach((socket) => {
      socket.disconnect();
    });
    setConnectedSockets({});
    setKeysSent({});
  };

  const startRecording = async () => {
    if (selectedPlatforms.size === 0) {
      alert("Please select at least one platform to stream to");
      return;
    }

    if (!mediaStream) return;

    // Connect to selected platform sockets and wait for connections
    const newSockets = {};
    const newKeysSent = {};

    for (const platform of selectedPlatforms) {
      const key = getPlatformKey(platform);
      if (!key) {
        alert(`No key configured for ${platform}`);
        return;
      }

      console.log(`Connecting to ${platform} socket...`);
      const socket = io(SOCKET_URLS[platform]);
      newSockets[platform] = socket;

      // Wait for connection and send key
      socket.on("connect", () => {
        console.log(`Connected to ${platform}, sending key...`);
        socket.emit("send-key", key);
        newKeysSent[platform] = true;
        setKeysSent((prev) => ({ ...prev, [platform]: true }));
      });
    }

    setConnectedSockets((prev) => ({ ...prev, ...newSockets }));

    const recorder = new MediaRecorder(mediaStream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      framerate: 25,
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        console.log("Binary Stream Available", event.data);

        // Send stream data to all connected platforms
        Object.entries(newSockets).forEach(([platform, socket]) => {
          if (socket.connected && newKeysSent[platform]) {
            socket.emit("binarystream", event.data);
          }
        });
      }
    };

    recorder.start(25);
    setMediaRecorder(recorder);
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }

    // Disconnect from all sockets
    disconnectSockets();

    setIsStreaming(false);
  };

  const handlePlatformConnect = (platform, rtmpKey) => {
    console.log(`Successfully connected to ${platform} with key:`, rtmpKey);

    // Update platform status in dashboard data
    setDashboardData((prevData) => ({
      ...prevData,
      platforms: prevData.platforms.map((p) =>
        p.name === platform ? { ...p, status: "connected" } : p
      ),
    }));

    // Store the key for the specific platform
    switch (platform) {
      case "YouTube":
        setYoutubeKey(rtmpKey);
        break;
      case "Twitch":
        setTwitchKey(rtmpKey);
        break;
      case "Facebook":
        setFacebookKey(rtmpKey);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Multi-Streaming Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.name}!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle variant="ghost" />
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Buttons Section */}
        <div className="mb-8">
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <PlatformButtons
              onPlatformConnect={handlePlatformConnect}
              user={user}
            />
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Live Viewers
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.liveViewers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Streams
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.totalStreams}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Stream Duration
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.streamDuration}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Platform Selection Section */}
        <div className="mb-8">
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Select Streaming Platforms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["YouTube", "Twitch", "Facebook"].map((platform) => {
                const hasKey = getPlatformKey(platform);
                const isSelected = selectedPlatforms.has(platform);

                return (
                  <div
                    key={platform}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      !hasKey
                        ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-border bg-background hover:border-blue-300"
                    } ${isStreaming ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() => {
                      if (!hasKey || isStreaming) return;

                      const newSelected = new Set(selectedPlatforms);
                      if (isSelected) {
                        newSelected.delete(platform);
                      } else {
                        newSelected.add(platform);
                      }
                      setSelectedPlatforms(newSelected);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!hasKey || isStreaming}
                        onChange={() => {}} // Handled by div onClick
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {platform}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {!hasKey
                            ? "No key configured"
                            : isSelected
                            ? "Selected for streaming"
                            : "Available"}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          !hasKey
                            ? "bg-gray-400"
                            : isSelected
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedPlatforms.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Selected platforms: {Array.from(selectedPlatforms).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Streaming Section */}
          <div className="bg-card rounded-lg shadow border border-border">
            <div className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Live Stream
              </h2>
              <div className="space-y-4">
                <div
                  className="relative bg-black rounded-lg overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!mediaStream && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <p>Camera not available</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-4 justify-center">
                  {!isStreaming ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Streaming
                    </button>
                  ) : (
                    <button
                      onClick={stopStreaming}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Streaming
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
