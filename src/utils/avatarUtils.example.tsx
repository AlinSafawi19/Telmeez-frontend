import React from 'react';
import InitialsAvatar from '../components/InitialsAvatar';
import { 
  createInitialsAvatar, 
  createInitialsAvatarWithStatus,
  generateInitials,
  type UserData 
} from './avatarUtils';

// Example usage of the avatar utility
const AvatarExamples: React.FC = () => {
  // Sample user data
  const sampleUsers: UserData[] = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com' },
    { name: 'Alice Brown', email: 'alice.brown@example.com' },
    { email: 'user@example.com' }, // Only email
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Avatar Utility Examples</h1>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Basic Usage</h2>
        <div className="flex items-center gap-4">
          {sampleUsers.map((user, index) => (
            <div key={index} className="text-center">
              <InitialsAvatar userData={user} />
              <p className="text-xs text-gray-600 mt-2">
                {user.firstName} {user.lastName}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Different Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Different Sizes</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} size="xs" />
            <p className="text-xs text-gray-600 mt-2">Extra Small</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} size="sm" />
            <p className="text-xs text-gray-600 mt-2">Small</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} size="md" />
            <p className="text-xs text-gray-600 mt-2">Medium</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} size="lg" />
            <p className="text-xs text-gray-600 mt-2">Large</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} size="xl" />
            <p className="text-xs text-gray-600 mt-2">Extra Large</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} size="2xl" />
            <p className="text-xs text-gray-600 mt-2">2XL</p>
          </div>
        </div>
      </section>

      {/* Different Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Different Variants</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="primary" />
            <p className="text-xs text-gray-600 mt-2">Primary</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="secondary" />
            <p className="text-xs text-gray-600 mt-2">Secondary</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="success" />
            <p className="text-xs text-gray-600 mt-2">Success</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="warning" />
            <p className="text-xs text-gray-600 mt-2">Warning</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="danger" />
            <p className="text-xs text-gray-600 mt-2">Danger</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="info" />
            <p className="text-xs text-gray-600 mt-2">Info</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="purple" />
            <p className="text-xs text-gray-600 mt-2">Purple</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} variant="blue" />
            <p className="text-xs text-gray-600 mt-2">Blue</p>
          </div>
        </div>
      </section>

      {/* With Status Indicators */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">With Status Indicators</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} showStatus isOnline={true} />
            <p className="text-xs text-gray-600 mt-2">Online</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[1]} showStatus isOnline={false} />
            <p className="text-xs text-gray-600 mt-2">Offline</p>
          </div>
        </div>
      </section>

      {/* Auto-colored Avatars */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Auto-colored Avatars</h2>
        <div className="flex items-center gap-4">
          {sampleUsers.map((user, index) => (
            <div key={index} className="text-center">
              <InitialsAvatar userData={user} autoColor />
              <p className="text-xs text-gray-600 mt-2">
                {user.firstName} {user.lastName}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Preset Avatars */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Preset Avatars</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} preset="admin" />
            <p className="text-xs text-gray-600 mt-2">Admin Preset</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[1]} preset="user" />
            <p className="text-xs text-gray-600 mt-2">User Preset</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[2]} preset="teacher" />
            <p className="text-xs text-gray-600 mt-2">Teacher Preset</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[3]} preset="student" />
            <p className="text-xs text-gray-600 mt-2">Student Preset</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[4]} preset="parent" />
            <p className="text-xs text-gray-600 mt-2">Parent Preset</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} preset="profile" />
            <p className="text-xs text-gray-600 mt-2">Profile Preset</p>
          </div>
        </div>
      </section>

      {/* Different Shapes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Different Shapes</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} shape="circle" />
            <p className="text-xs text-gray-600 mt-2">Circle</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} shape="rounded" />
            <p className="text-xs text-gray-600 mt-2">Rounded</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} shape="square" />
            <p className="text-xs text-gray-600 mt-2">Square</p>
          </div>
        </div>
      </section>

      {/* With Borders and Shadows */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">With Borders and Shadows</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} border shadow />
            <p className="text-xs text-gray-600 mt-2">Border + Shadow</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} border borderColor="border-red-300" />
            <p className="text-xs text-gray-600 mt-2">Custom Border</p>
          </div>
          <div className="text-center">
            <InitialsAvatar userData={sampleUsers[0]} shadow />
            <p className="text-xs text-gray-600 mt-2">Shadow Only</p>
          </div>
        </div>
      </section>

      {/* Clickable Avatars */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Clickable Avatars</h2>
        <div className="flex items-center gap-4">
          {sampleUsers.slice(0, 3).map((user, index) => (
            <div key={index} className="text-center">
              <InitialsAvatar 
                userData={user} 
                onClick={() => alert(`Clicked on ${user.firstName} ${user.lastName}`)}
                className="hover:scale-110 transition-transform"
              />
              <p className="text-xs text-gray-600 mt-2">Clickable</p>
            </div>
          ))}
        </div>
      </section>

      {/* Utility Function Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Utility Function Examples</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Generate Initials Only:</h3>
          <div className="space-y-2 text-sm">
            {sampleUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-mono bg-white px-2 py-1 rounded">
                  {generateInitials(user)}
                </span>
                <span className="text-gray-600">
                  from {user.firstName} {user.lastName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Function Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Direct Function Usage</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            {createInitialsAvatar(sampleUsers[0], { size: 'lg', variant: 'purple' })}
            <p className="text-xs text-gray-600 mt-2">Direct Function</p>
          </div>
          <div className="text-center">
            {createInitialsAvatarWithStatus(sampleUsers[1], true, { size: 'lg', variant: 'blue' })}
            <p className="text-xs text-gray-600 mt-2">With Status</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AvatarExamples; 