import { useState } from 'react';
import { Plus, Check, Settings } from 'lucide-react';

const PlatformButton = ({ 
  platform, 
  icon: Icon, 
  isConnected = false, 
  onClick,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Platform-specific styling
  const platformStyles = {
    YouTube: {
      bg: 'bg-red-500 hover:bg-red-600',
      text: 'text-white',
      border: 'border-red-500',
      connectedBg: 'bg-red-50 dark:bg-red-950',
      connectedBorder: 'border-red-200 dark:border-red-800',
      connectedText: 'text-red-700 dark:text-red-300'
    },
    Twitch: {
      bg: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-white',
      border: 'border-purple-500',
      connectedBg: 'bg-purple-50 dark:bg-purple-950',
      connectedBorder: 'border-purple-200 dark:border-purple-800',
      connectedText: 'text-purple-700 dark:text-purple-300'
    },
    Facebook: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-white',
      border: 'border-blue-600',
      connectedBg: 'bg-blue-50 dark:bg-blue-950',
      connectedBorder: 'border-blue-200 dark:border-blue-800',
      connectedText: 'text-blue-700 dark:text-blue-300'
    },
    Instagram: {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      text: 'text-white',
      border: 'border-pink-500',
      connectedBg: 'bg-pink-50 dark:bg-pink-950',
      connectedBorder: 'border-pink-200 dark:border-pink-800',
      connectedText: 'text-pink-700 dark:text-pink-300'
    },
    TikTok: {
      bg: 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200',
      text: 'text-white dark:text-black',
      border: 'border-black dark:border-white',
      connectedBg: 'bg-gray-50 dark:bg-gray-950',
      connectedBorder: 'border-gray-200 dark:border-gray-800',
      connectedText: 'text-gray-700 dark:text-gray-300'
    },
    Discord: {
      bg: 'bg-indigo-500 hover:bg-indigo-600',
      text: 'text-white',
      border: 'border-indigo-500',
      connectedBg: 'bg-indigo-50 dark:bg-indigo-950',
      connectedBorder: 'border-indigo-200 dark:border-indigo-800',
      connectedText: 'text-indigo-700 dark:text-indigo-300'
    }
  };

  const styles = platformStyles[platform] || platformStyles.YouTube;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group w-full p-4 rounded-lg border-2 transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${isConnected 
          ? `${styles.connectedBg} ${styles.connectedBorder} ${styles.connectedText}` 
          : `${styles.bg} ${styles.text} ${styles.border} hover:scale-105 hover:shadow-lg`
        }
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Platform Icon */}
          <div className={`
            p-2 rounded-lg 
            ${isConnected 
              ? 'bg-background border border-border' 
              : 'bg-white/20 backdrop-blur-sm'
            }
          `}>
            <Icon className={`
              w-6 h-6 
              ${isConnected 
                ? styles.connectedText 
                : 'text-current'
              }
            `} />
          </div>
          
          {/* Platform Name */}
          <div className="text-left">
            <h3 className="font-semibold text-sm">
              {platform}
            </h3>
            <p className={`
              text-xs 
              ${isConnected 
                ? 'text-muted-foreground' 
                : 'text-current opacity-80'
              }
            `}>
              {isConnected ? 'Connected' : 'Click to connect'}
            </p>
          </div>
        </div>

        {/* Status Icon */}
        <div className={`
          p-2 rounded-full transition-all duration-200
          ${isConnected 
            ? 'bg-green-100 dark:bg-green-900' 
            : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'
          }
        `}>
          {isConnected ? (
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : isHovered ? (
            <Settings className="w-4 h-4 text-current" />
          ) : (
            <Plus className="w-4 h-4 text-current" />
          )}
        </div>
      </div>

      {/* Connected indicator */}
      {isConnected && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}

      {/* Hover effect overlay */}
      {!isConnected && (
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      )}
    </button>
  );
};

export default PlatformButton;
