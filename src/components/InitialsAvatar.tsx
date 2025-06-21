import React from 'react';
import type { AvatarConfig, UserData } from '../utils/avatarUtils';
import { 
  createInitialsAvatar, 
  createInitialsAvatarWithStatus,
  createAutoColoredInitialsAvatar,
  avatarPresets
} from '../utils/avatarUtils';

interface InitialsAvatarProps extends AvatarConfig {
  userData: UserData;
  isOnline?: boolean;
  showStatus?: boolean;
  autoColor?: boolean;
  preset?: keyof typeof avatarPresets;
  onClick?: () => void;
  alt?: string;
  title?: string;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  userData,
  isOnline = false,
  showStatus = false,
  autoColor = false,
  preset,
  onClick,
  alt,
  title,
  ...config
}) => {
  // Generate alt text if not provided
  const altText = alt || `${userData.firstName || ''} ${userData.lastName || ''} avatar`.trim() || 'User avatar';
  
  // Generate title if not provided
  const titleText = title || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User';

  // Use preset if specified
  if (preset) {
    const presetAvatar = avatarPresets[preset](userData, isOnline);
    return (
      <div 
        onClick={onClick}
        className={onClick ? 'cursor-pointer' : ''}
        title={titleText}
        aria-label={altText}
      >
        {presetAvatar}
      </div>
    );
  }

  // Use auto-colored avatar if requested
  if (autoColor) {
    const autoColoredAvatar = createAutoColoredInitialsAvatar(userData, config);
    return (
      <div 
        onClick={onClick}
        className={onClick ? 'cursor-pointer' : ''}
        title={titleText}
        aria-label={altText}
      >
        {autoColoredAvatar}
      </div>
    );
  }

  // Use status avatar if showStatus is true
  if (showStatus) {
    const statusAvatar = createInitialsAvatarWithStatus(userData, isOnline, config);
    return (
      <div 
        onClick={onClick}
        className={onClick ? 'cursor-pointer' : ''}
        title={titleText}
        aria-label={altText}
      >
        {statusAvatar}
      </div>
    );
  }

  // Default initials avatar
  const avatar = createInitialsAvatar(userData, config);
  return (
    <div 
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
      title={titleText}
      aria-label={altText}
    >
      {avatar}
    </div>
  );
};

export default InitialsAvatar; 