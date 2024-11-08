// src/pages/UserProfilePage.jsx
import { getCurrentUser } from '../services/Auth';

const UserProfilePage = () => {
  const user = getCurrentUser();
  if (!user) return <div>Please log in to see your profile.</div>;

  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      {/* Display past and upcoming events */}
    </div>
  );
};

export default UserProfilePage;
