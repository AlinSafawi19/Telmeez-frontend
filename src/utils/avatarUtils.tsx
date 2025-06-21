import React from 'react';

// Types for avatar configuration
export interface AvatarConfig {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'gray';
  shape?: 'circle' | 'square' | 'rounded';
  border?: boolean;
  borderColor?: string;
  shadow?: boolean;
  className?: string;
}

export interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
}

// Default configuration
const defaultConfig: AvatarConfig = {
  size: 'md',
  variant: 'default',
  shape: 'circle',
  border: false,
  shadow: false,
};

// Size configurations
const sizeConfigs = {
  xs: { size: 'w-6 h-6', text: 'text-xs' },
  sm: { size: 'w-8 h-8', text: 'text-xs' },
  md: { size: 'w-10 h-10', text: 'text-sm' },
  lg: { size: 'w-12 h-12', text: 'text-sm' },
  xl: { size: 'w-16 h-16', text: 'text-lg' },
  '2xl': { size: 'w-24 h-24', text: 'text-2xl' },
};

// Variant configurations with gradients and colors
const variantConfigs = {
  default: {
    bg: 'bg-gray-200',
    text: 'text-gray-600',
    border: 'border-gray-300',
    gradient: 'bg-gradient-to-br from-gray-200 to-gray-300',
  },
  primary: {
    bg: 'bg-blue-200',
    text: 'text-blue-700',
    border: 'border-blue-300',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  secondary: {
    bg: 'bg-purple-200',
    text: 'text-purple-700',
    border: 'border-purple-300',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
  success: {
    bg: 'bg-green-200',
    text: 'text-green-700',
    border: 'border-green-300',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600',
  },
  warning: {
    bg: 'bg-yellow-200',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
  },
  danger: {
    bg: 'bg-red-200',
    text: 'text-red-700',
    border: 'border-red-300',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600',
  },
  info: {
    bg: 'bg-cyan-200',
    text: 'text-cyan-700',
    border: 'border-cyan-300',
    gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
  },
  purple: {
    bg: 'bg-purple-200',
    text: 'text-purple-700',
    border: 'border-purple-300',
    gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600',
  },
  blue: {
    bg: 'bg-blue-200',
    text: 'text-blue-700',
    border: 'border-blue-300',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  },
  green: {
    bg: 'bg-green-200',
    text: 'text-green-700',
    border: 'border-green-300',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
  },
  orange: {
    bg: 'bg-orange-200',
    text: 'text-orange-700',
    border: 'border-orange-300',
    gradient: 'bg-gradient-to-br from-orange-500 to-amber-600',
  },
  red: {
    bg: 'bg-red-200',
    text: 'text-red-700',
    border: 'border-red-300',
    gradient: 'bg-gradient-to-br from-red-500 to-pink-600',
  },
  gray: {
    bg: 'bg-gray-200',
    text: 'text-gray-600',
    border: 'border-gray-300',
    gradient: 'bg-gradient-to-br from-gray-400 to-gray-500',
  },
};

// Shape configurations
const shapeConfigs = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

/**
 * Generate initials from user data
 * @param userData - User data containing name information
 * @param fallback - Fallback text if no name is available
 * @returns Initials string
 */
export const generateInitials = (userData: UserData, fallback: string = 'U'): string => {
  const { firstName, lastName, name, email } = userData;

  // Try to get initials from firstName and lastName
  if (firstName && lastName) {
    const firstInitial = firstName.trim().charAt(0).toUpperCase();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  // Try to get initials from full name
  if (name) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      const firstInitial = nameParts[0].charAt(0).toUpperCase();
      const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
      return `${firstInitial}${lastInitial}`;
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
  }

  // Try to get initial from email
  if (email) {
    const emailInitial = email.charAt(0).toUpperCase();
    return emailInitial;
  }

  // Return fallback
  return fallback;
};

/**
 * Generate initials from admin/user object (for backward compatibility)
 * @param userId - User ID to find in admin list
 * @param admins - Array of admin objects
 * @param fallback - Fallback text if no admin is found
 * @returns Initials string
 */
export const generateInitialsFromAdmin = (
  userId: string,
  admins: any[],
  fallback: string = 'U'
): string => {
  const admin = admins.find(a => a.id === userId);
  if (admin) {
    const firstName = admin.first_name?.trim() || '';
    const lastName = admin.last_name?.trim() || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    return `${firstInitial}${lastInitial}`;
  }
  return fallback;
};

/**
 * Build CSS classes for avatar based on configuration
 * @param config - Avatar configuration
 * @returns Object with container and text classes
 */
export const buildAvatarClasses = (config: AvatarConfig) => {
  const finalConfig = { ...defaultConfig, ...config };
  const size = sizeConfigs[finalConfig.size!];
  const variant = variantConfigs[finalConfig.variant!];
  const shape = shapeConfigs[finalConfig.shape!];

  const containerClasses = [
    size.size,
    shape,
    'flex',
    'items-center',
    'justify-center',
    'font-semibold',
    finalConfig.shadow ? 'shadow' : '',
    finalConfig.border ? `border-2 ${variant.border}` : '',
    finalConfig.className || '',
  ].filter(Boolean).join(' ');

  const textClasses = [
    size.text,
    'font-semibold',
    finalConfig.variant === 'default' ? variant.text : 'text-white',
  ].join(' ');

  const backgroundClasses = finalConfig.variant === 'default' ? variant.bg : variant.gradient;

  return {
    container: containerClasses,
    text: textClasses,
    background: backgroundClasses,
  };
};

/**
 * Create a React component for initials avatar
 * @param userData - User data
 * @param config - Avatar configuration
 * @returns JSX element
 */
export const createInitialsAvatar = (
  userData: UserData,
  config: AvatarConfig = {}
): React.JSX.Element => {
  const initials = generateInitials(userData);
  const classes = buildAvatarClasses(config);

  return (
    <div className={`${classes.container} ${classes.background}`}>
      <span className={classes.text}>{initials}</span>
    </div>
  );
};

/**
 * Create initials avatar component with online status indicator
 * @param userData - User data
 * @param isOnline - Online status
 * @param config - Avatar configuration
 * @returns JSX element
 */
export const createInitialsAvatarWithStatus = (
  userData: UserData,
  isOnline: boolean = false,
  config: AvatarConfig = {}
): React.JSX.Element => {
  const initials = generateInitials(userData);
  const classes = buildAvatarClasses(config);

  return (
    <div className="relative">
      <div className={`${classes.container} ${classes.background}`}>
        <span className={classes.text}>{initials}</span>
      </div>
      <div 
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
    </div>
  );
};

/**
 * Create initials avatar with custom border color
 * @param userData - User data
 * @param borderColor - Custom border color class
 * @param config - Avatar configuration
 * @returns JSX element
 */
export const createInitialsAvatarWithBorder = (
  userData: UserData,
  borderColor: string,
  config: AvatarConfig = {}
): React.JSX.Element => {
  const initials = generateInitials(userData);
  const classes = buildAvatarClasses({ ...config, border: true });

  return (
    <div className={`${classes.container} ${classes.background} border-2 ${borderColor}`}>
      <span className={classes.text}>{initials}</span>
    </div>
  );
};

/**
 * Generate a consistent color variant based on user data
 * @param userData - User data
 * @returns Color variant
 */
export const getVariantFromUserData = (userData: UserData): keyof typeof variantConfigs => {
  const { firstName, lastName, email } = userData;
  const name = `${firstName || ''}${lastName || ''}${email || ''}`;
  
  // Simple hash function to generate consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const variants: (keyof typeof variantConfigs)[] = [
    'primary', 'secondary', 'success', 'warning', 'danger', 
    'info', 'purple', 'blue', 'green', 'orange', 'red'
  ];
  
  return variants[Math.abs(hash) % variants.length];
};

/**
 * Create initials avatar with auto-generated color variant
 * @param userData - User data
 * @param config - Avatar configuration
 * @returns JSX element
 */
export const createAutoColoredInitialsAvatar = (
  userData: UserData,
  config: AvatarConfig = {}
): React.JSX.Element => {
  const autoVariant = getVariantFromUserData(userData);
  return createInitialsAvatar(userData, { ...config, variant: autoVariant });
};

// Predefined avatar configurations for common use cases
export const avatarPresets = {
  // Small avatar for lists
  list: (userData: UserData) => createInitialsAvatar(userData, {
    size: 'sm',
    variant: 'default',
    shape: 'circle',
    shadow: false,
  }),

  // Medium avatar for cards
  card: (userData: UserData) => createInitialsAvatar(userData, {
    size: 'md',
    variant: 'default',
    shape: 'circle',
    shadow: true,
  }),

  // Large avatar for profile headers
  profile: (userData: UserData) => createInitialsAvatar(userData, {
    size: 'xl',
    variant: 'primary',
    shape: 'circle',
    shadow: true,
    border: true,
  }),

  // Extra large avatar for hero sections
  hero: (userData: UserData) => createInitialsAvatar(userData, {
    size: '2xl',
    variant: 'secondary',
    shape: 'circle',
    shadow: true,
    border: true,
  }),

  // Admin avatar with purple theme
  admin: (userData: UserData, isOnline: boolean = false) => 
    createInitialsAvatarWithStatus(userData, isOnline, {
      size: 'lg',
      variant: 'purple',
      shape: 'circle',
      shadow: true,
      border: true,
      borderColor: 'border-purple-200',
    }),

  // User avatar with blue theme
  user: (userData: UserData, isOnline: boolean = false) => 
    createInitialsAvatarWithStatus(userData, isOnline, {
      size: 'md',
      variant: 'blue',
      shape: 'circle',
      shadow: true,
    }),

  // Teacher avatar with green theme
  teacher: (userData: UserData) => createInitialsAvatar(userData, {
    size: 'md',
    variant: 'green',
    shape: 'circle',
    shadow: true,
  }),

  // Student avatar with orange theme
  student: (userData: UserData) => createInitialsAvatar(userData, {
    size: 'md',
    variant: 'orange',
    shape: 'circle',
    shadow: true,
  }),

  // Parent avatar with info theme
  parent: (userData: UserData) => createInitialsAvatar(userData, {
    size: 'md',
    variant: 'info',
    shape: 'circle',
    shadow: true,
  }),
};

export default {
  generateInitials,
  generateInitialsFromAdmin,
  createInitialsAvatar,
  createInitialsAvatarWithStatus,
  createInitialsAvatarWithBorder,
  createAutoColoredInitialsAvatar,
  getVariantFromUserData,
  avatarPresets,
  buildAvatarClasses,
}; 