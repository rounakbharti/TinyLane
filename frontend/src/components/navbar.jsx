import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-gray-800 dark:text-white">Short.ly</Link>
      <div>
        {token ? (
          <Button onClick={handleLogout} variant="ghost" className="text-gray-600 dark:text-gray-300">Logout</Button>
        ) : (
          <>
            <Link to="/signup" className="mr-4 text-gray-600 dark:text-gray-300 hover:underline">Signup</Link>
            <Link to="/login" className="mr-4 text-gray-600 dark:text-gray-300 hover:underline">Login</Link>
          </>
        )}
        <Button onClick={toggleDarkMode} variant="ghost" className="text-gray-600 dark:text-gray-300">
          {darkMode ? 'Light' : 'Dark'}
        </Button>
      </div>
    </nav>
  );
}