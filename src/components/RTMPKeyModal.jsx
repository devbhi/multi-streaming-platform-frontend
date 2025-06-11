import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Key, ExternalLink } from 'lucide-react';
import Modal from './Modal';

const RTMPKeyModal = ({ isOpen, onClose, platform, onSave }) => {
  const [rtmpKey, setRtmpKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Platform-specific information
  const platformInfo = {
    YouTube: {
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      helpUrl: 'https://support.google.com/youtube/answer/2474026',
      instructions: 'Go to YouTube Studio → Settings → Stream → Stream key'
    },
    Twitch: {
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
      helpUrl: 'https://help.twitch.tv/s/article/twitch-stream-key',
      instructions: 'Go to Twitch Creator Dashboard → Settings → Stream → Primary Stream key'
    },
    Facebook: {
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      helpUrl: 'https://www.facebook.com/help/1636872026560015',
      instructions: 'Go to Facebook → Live → Use Stream Key → Copy Stream Key'
    },
    Instagram: {
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      borderColor: 'border-pink-200 dark:border-pink-800',
      helpUrl: 'https://help.instagram.com/1016136705211157',
      instructions: 'Go to Instagram → Live → Professional Dashboard → Stream Key'
    },
    TikTok: {
      color: 'text-black dark:text-white',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
      helpUrl: 'https://www.tiktok.com/creators/creator-portal/en-us/live-streaming/live-streaming-on-tiktok/',
      instructions: 'Go to TikTok Live Studio → Get Stream Key'
    },
    Discord: {
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      helpUrl: 'https://support.discord.com/hc/en-us/articles/360040816151-Go-Live-and-Screen-Share',
      instructions: 'Available through Discord Go Live feature'
    }
  };

  const info = platformInfo[platform] || platformInfo.YouTube;

  const handleSave = async () => {
    if (!rtmpKey.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(platform, rtmpKey.trim());
      setRtmpKey('');
      onClose();
    } catch (error) {
      console.error('Error saving RTMP key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rtmpKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClose = () => {
    setRtmpKey('');
    setShowKey(false);
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add ${platform} RTMP Key`}
      size="default"
    >
      <div className="space-y-6">
        {/* Platform Info */}
        <div className={`p-4 rounded-lg ${info.bgColor} border ${info.borderColor}`}>
          <div className="flex items-start space-x-3">
            <Key className={`w-5 h-5 mt-0.5 ${info.color}`} />
            <div className="flex-1">
              <h4 className={`font-medium ${info.color}`}>
                How to get your {platform} Stream Key
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {info.instructions}
              </p>
              <a
                href={info.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm ${info.color} hover:underline mt-2`}
              >
                View detailed guide
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* RTMP Key Input */}
        <div className="space-y-2">
          <label htmlFor="rtmpKey" className="block text-sm font-medium text-foreground">
            RTMP Stream Key
          </label>
          <div className="relative">
            <input
              id="rtmpKey"
              type={showKey ? 'text' : 'password'}
              value={rtmpKey}
              onChange={(e) => setRtmpKey(e.target.value)}
              placeholder="Enter your RTMP stream key..."
              className="w-full px-3 py-2 pr-20 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
              {rtmpKey && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 hover:bg-accent rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1 hover:bg-accent rounded transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Your RTMP key will be stored securely and used for streaming to {platform}.
          </p>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Important:</strong> Keep your stream key private. Anyone with access to your stream key can stream to your account.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!rtmpKey.trim() || isLoading}
            className={`px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${info.color}`}
          >
            {isLoading ? 'Saving...' : 'Save Key'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RTMPKeyModal;
