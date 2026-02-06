import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

const Admin = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminPanel user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Admin;
