import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.response);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/90 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
          <CardTitle className="text-4xl font-extrabold text-white text-center drop-shadow-lg">
            TinyLane
          </CardTitle>
          <p className="text-xl font-semibold text-white text-center mt-2">Login</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gray-800 font-medium">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm rounded-lg transition-all duration-200 bg-white/50"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-800 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm rounded-lg transition-all duration-200 bg-white/50"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            <Button
              type="submit"
              disabled={!username.trim() || !password.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              Login
            </Button>
          </form>
          <p className="mt-4 text-gray-600 text-center">
            Don’t have an account?{' '}
            <a href="/signup" className="text-indigo-500 hover:underline font-semibold">Sign Up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}