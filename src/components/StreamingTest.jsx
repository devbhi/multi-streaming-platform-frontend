import { useState, useEffect } from "react";
import io from "socket.io-client";

// Test component to verify multi-platform streaming functionality
const StreamingTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const SOCKET_URLS = {
    YouTube: "http://localhost:3000",
    Twitch: "http://localhost:5000",
    Facebook: "http://localhost:6001",
  };

  const testSocketConnections = async () => {
    setIsRunning(true);
    const results = {};

    for (const [platform, url] of Object.entries(SOCKET_URLS)) {
      try {
        console.log(`Testing connection to ${platform} at ${url}`);

        const socket = io(url, { timeout: 5000 });

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            socket.disconnect();
            reject(new Error("Connection timeout"));
          }, 5000);

          socket.on("connect", () => {
            clearTimeout(timeout);
            results[platform] = {
              status: "success",
              message: "Connected successfully",
              url: url,
            };
            socket.disconnect();
            resolve();
          });

          socket.on("connect_error", (error) => {
            clearTimeout(timeout);
            results[platform] = {
              status: "error",
              message: `Connection failed: ${error.message}`,
              url: url,
            };
            reject(error);
          });
        });
      } catch (error) {
        results[platform] = {
          status: "error",
          message: error.message,
          url: SOCKET_URLS[platform],
        };
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Multi-Platform Streaming Connection Test
        </h2>

        <div className="mb-6">
          <button
            onClick={testSocketConnections}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium ${
              isRunning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isRunning ? "Testing Connections..." : "Test Socket Connections"}
          </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Test Results:
            </h3>

            {Object.entries(testResults).map(([platform, result]) => (
              <div
                key={platform}
                className={`p-4 rounded-lg border ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {platform}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {result.url}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        result.status === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        result.status === "success"
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {result.status === "success" ? "Connected" : "Failed"}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {result.message}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Expected Server Setup:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• YouTube streaming server running on http://localhost:3000</li>
            <li>• Twitch streaming server running on http://localhost:5000</li>
            <li>
              • Facebook streaming server running on http://localhost:6000
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StreamingTest;
