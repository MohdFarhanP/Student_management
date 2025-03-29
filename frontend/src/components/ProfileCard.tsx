import React from 'react';

interface ProfileCardProps {
  name: string;
  email: string;
  role: string;
  additionalInfo: { [key: string]: string };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  role,
  additionalInfo,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-black">{name}</h2>
      <p className="text-gray-700">
        <strong>Email:</strong> {email}
      </p>
      <p className="text-gray-700">
        <strong>Role:</strong> {role}
      </p>
      {Object.entries(additionalInfo).map(([key, value]) => (
        <p key={key} className="text-gray-700">
          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
        </p>
      ))}
    </div>
  );
};

export default ProfileCard;
