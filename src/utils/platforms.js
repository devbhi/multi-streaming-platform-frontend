// Platform utility functions and configurations

export const PLATFORMS = {
  YOUTUBE: 'YouTube',
  TWITCH: 'Twitch',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  DISCORD: 'Discord'
};

export const PLATFORM_CONFIGS = {
  [PLATFORMS.YOUTUBE]: {
    name: 'YouTube',
    color: '#FF0000',
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2/',
    helpUrl: 'https://support.google.com/youtube/answer/2474026',
    instructions: 'Go to YouTube Studio → Settings → Stream → Stream key',
    requiresKey: true
  },
  [PLATFORMS.TWITCH]: {
    name: 'Twitch',
    color: '#9146FF',
    rtmpUrl: 'rtmp://live.twitch.tv/live/',
    helpUrl: 'https://help.twitch.tv/s/article/twitch-stream-key',
    instructions: 'Go to Twitch Creator Dashboard → Settings → Stream → Primary Stream key',
    requiresKey: true
  },
  [PLATFORMS.FACEBOOK]: {
    name: 'Facebook',
    color: '#1877F2',
    rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    helpUrl: 'https://www.facebook.com/help/1636872026560015',
    instructions: 'Go to Facebook → Live → Use Stream Key → Copy Stream Key',
    requiresKey: true
  },
  [PLATFORMS.INSTAGRAM]: {
    name: 'Instagram',
    color: '#E4405F',
    rtmpUrl: 'rtmps://live-upload.instagram.com:443/rtmp/',
    helpUrl: 'https://help.instagram.com/1016136705211157',
    instructions: 'Go to Instagram → Live → Professional Dashboard → Stream Key',
    requiresKey: true
  },
  [PLATFORMS.TIKTOK]: {
    name: 'TikTok',
    color: '#000000',
    rtmpUrl: 'rtmp://push.tiktokcdn.com/live/',
    helpUrl: 'https://www.tiktok.com/creators/creator-portal/en-us/live-streaming/live-streaming-on-tiktok/',
    instructions: 'Go to TikTok Live Studio → Get Stream Key',
    requiresKey: true
  },
  [PLATFORMS.DISCORD]: {
    name: 'Discord',
    color: '#5865F2',
    rtmpUrl: null, // Discord uses Go Live feature, not RTMP
    helpUrl: 'https://support.discord.com/hc/en-us/articles/360040816151-Go-Live-and-Screen-Share',
    instructions: 'Available through Discord Go Live feature',
    requiresKey: false
  }
};

export const validateRTMPKey = (platform, key) => {
  if (!key || typeof key !== 'string') {
    return { isValid: false, error: 'RTMP key is required' };
  }

  const trimmedKey = key.trim();
  
  if (trimmedKey.length === 0) {
    return { isValid: false, error: 'RTMP key cannot be empty' };
  }

  // Platform-specific validation
  switch (platform) {
    case PLATFORMS.YOUTUBE:
      // YouTube keys are typically 24-44 characters
      if (trimmedKey.length < 20 || trimmedKey.length > 50) {
        return { isValid: false, error: 'YouTube stream key should be 20-50 characters' };
      }
      break;
    
    case PLATFORMS.TWITCH:
      // Twitch keys start with 'live_' and are followed by numbers/letters
      if (!trimmedKey.startsWith('live_') && trimmedKey.length < 30) {
        return { isValid: false, error: 'Invalid Twitch stream key format' };
      }
      break;
    
    case PLATFORMS.FACEBOOK:
      // Facebook keys are typically longer
      if (trimmedKey.length < 30) {
        return { isValid: false, error: 'Facebook stream key appears to be too short' };
      }
      break;
    
    default:
      // Generic validation for other platforms
      if (trimmedKey.length < 10) {
        return { isValid: false, error: 'Stream key appears to be too short' };
      }
  }

  return { isValid: true, error: null };
};

export const formatPlatformName = (platform) => {
  return PLATFORM_CONFIGS[platform]?.name || platform;
};

export const getPlatformColor = (platform) => {
  return PLATFORM_CONFIGS[platform]?.color || '#6B7280';
};

export const getPlatformRTMPUrl = (platform) => {
  return PLATFORM_CONFIGS[platform]?.rtmpUrl;
};

export const buildRTMPUrl = (platform, streamKey) => {
  const baseUrl = getPlatformRTMPUrl(platform);
  if (!baseUrl || !streamKey) return null;
  
  return `${baseUrl}${streamKey}`;
};

export const maskStreamKey = (key, visibleChars = 4) => {
  if (!key || key.length <= visibleChars * 2) return key;
  
  const start = key.substring(0, visibleChars);
  const end = key.substring(key.length - visibleChars);
  const middle = '*'.repeat(Math.max(8, key.length - visibleChars * 2));
  
  return `${start}${middle}${end}`;
};

export const getStoredPlatformKeys = () => {
  try {
    const keys = localStorage.getItem('platformKeys');
    return keys ? JSON.parse(keys) : {};
  } catch (error) {
    console.error('Error reading platform keys:', error);
    return {};
  }
};

export const storePlatformKey = (platform, key) => {
  try {
    const existingKeys = getStoredPlatformKeys();
    const updatedKeys = { ...existingKeys, [platform]: key };
    localStorage.setItem('platformKeys', JSON.stringify(updatedKeys));
    return true;
  } catch (error) {
    console.error('Error storing platform key:', error);
    return false;
  }
};

export const removePlatformKey = (platform) => {
  try {
    const existingKeys = getStoredPlatformKeys();
    delete existingKeys[platform];
    localStorage.setItem('platformKeys', JSON.stringify(existingKeys));
    return true;
  } catch (error) {
    console.error('Error removing platform key:', error);
    return false;
  }
};
