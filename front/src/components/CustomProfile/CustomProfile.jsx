
import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

function CustomProfile() {
  return (
    <UserProfile
      path="/profile"
      readOnly // This makes all fields, including the username, uneditable
    />
  );
}

export default React.memo(CustomProfile);

