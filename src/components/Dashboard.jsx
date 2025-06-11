import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { authService } from "../services/authService";
import { LogOut, Play, Square, Users, Eye, Clock } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const socket = io("http://localhost:3000");

const Dashboard = ({ user, onLogout }) => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [keySent, setKeySent] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Default dashboard data
  const [dashboardData] = useState({
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
    const fetchYoutubeKey = async () => {
      try {
        const result = await authService.getYouTubeKey(user.id);
        if (result.success) {
          setYoutubeKey(result.youtubeKey);
        } else {
          console.error("Error fetching YouTube key:", result.error);
        }
      } catch (error) {
        console.error("Error fetching YouTube key:", error);
      }
    };

    fetchYoutubeKey();
  }, [user.id]);

  const startStreaming = () => {
    if (!mediaStream) return;

    const recorder = new MediaRecorder(mediaStream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
    });

    recorder.ondataavailable = (event) => {
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

    recorder.start(25);
    setMediaRecorder(recorder);
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    setIsStreaming(false);
    setKeySent(false);
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <div className="flex space-x-4">
                  {!isStreaming ? (
                    <button
                      onClick={startStreaming}
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

          {/* Platform Status */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow border border-border p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Platform Status
              </h2>
              <div className="space-y-3">
                {dashboardData.platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-background"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          platform.status === "connected"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium text-foreground">
                        {platform.name}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {platform.viewers} viewers
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Streams */}
            <div className="bg-card rounded-lg shadow border border-border p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Recent Streams
              </h2>
              <div className="space-y-3">
                {dashboardData.recentStreams.map((stream, index) => (
                  <div
                    key={index}
                    className="p-3 border border-border rounded-lg bg-background"
                  >
                    <div className="font-medium text-foreground">
                      {stream.title}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stream.date} • {stream.duration} • {stream.viewers}{" "}
                      viewers
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
