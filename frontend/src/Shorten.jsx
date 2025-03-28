import { useState, useEffect, useMemo } from 'react';
import { shortenUrl, getUserUrls } from './api';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './components/ui/pagination';
import { useNavigate } from 'react-router-dom';

export default function Shorten() {
  const [url, setUrl] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [pastUrls, setPastUrls] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const urlsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPastUrls = async () => {
      try {
        const response = await getUserUrls();
        const sortedUrls = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPastUrls(sortedUrls);
      } catch (err) {
        console.error('Error fetching past URLs:', err.response);
      }
    };
    fetchPastUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await shortenUrl({ original_url: url, expires_in: expiresIn });
      setShortUrl(response.data.short_url);
      setPastUrls((prev) => [response.data, ...prev]);
      setUrl('');
      setExpiresIn('');
      setError('');
    } catch (err) {
      console.error('Shorten error:', err.response);
      setError(err.response?.data?.error || 'Failed to shorten URL');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = pastUrls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(pastUrls.length / urlsPerPage);

  const paginationLinks = useMemo(() => {
    return [...Array(totalPages)].map((_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => setCurrentPage(i + 1)}
          isActive={currentPage === i + 1}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-gray-800 font-medium cursor-pointer ${
            currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100'
          } transition-all duration-150`}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ));
  }, [currentPage, totalPages]);

  const isUrlExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 flex items-center justify-center">
      <div className="container max-w-5xl relative">
        <Button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-all duration-200 active:scale-95 z-10"
        >
          Logout
        </Button>

        <h1 className="text-4xl font-extrabold text-white mb-10 text-center drop-shadow-lg">TinyLane</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <Card className="flex-1 bg-white/90 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <CardTitle className="text-2xl font-semibold text-white">Create a Short URL</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="url" className="text-gray-800 font-medium">Original URL</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm rounded-lg transition-all duration-200 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="expiresIn" className="text-gray-800 font-medium">Expires In (minutes, optional)</Label>
                  <Input
                    id="expiresIn"
                    type="number"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    placeholder="e.g., 10"
                    min="1"
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm rounded-lg transition-all duration-200 bg-white/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!url.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                >
                  Shorten Now
                </Button>
              </form>
              {shortUrl && (
                <p className="mt-4 text-green-600 font-medium">
                  Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{shortUrl}</a>
                </p>
              )}
              {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
            </CardContent>
          </Card>

          <Card className="flex-[2] bg-white/90 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 flex justify-center">
              <CardTitle className="text-2xl font-semibold text-white text-center">Your URL History</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {pastUrls.length === 0 ? (
                <p className="text-gray-500 text-center">No URLs created yet.</p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {currentUrls.map((urlData) => (
                      <li
                        key={urlData.short_code}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg shadow-md hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors duration-200 gap-4 w-full"
                      >
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                          <div className="flex-1 min-w-0">
                            <a
                              href={urlData.short_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500 hover:underline font-semibold truncate block w-full"
                            >
                              {urlData.short_url}
                            </a>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate w-full">{urlData.original_url}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 w-full">
                              Expires: {urlData.expires_at ? new Date(urlData.expires_at).toLocaleString() : 'Never'}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold text-white shrink-0 ${
                              isUrlExpired(urlData.expires_at) ? 'bg-red-500' : 'bg-green-500'
                            }`}
                          >
                            {isUrlExpired(urlData.expires_at) ? 'Expired' : 'Active'}
                          </span>
                        </div>
                        <Button
                          onClick={() => navigate(`/analytics/${urlData.short_code}`)}
                          className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transform hover:scale-105 transition-all duration-200 shrink-0 w-full sm:w-24"
                        >
                          Analytics
                        </Button>
                      </li>
                    ))}
                  </ul>
                  {totalPages > 1 && (
                    <Pagination className="mt-6 bg-white/80 rounded-lg p-2 shadow-lg">
                      <PaginationContent className="flex gap-4 justify-center">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-gray-800 font-medium cursor-pointer ${
                              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-100'
                            } transition-all duration-150`}
                          />
                        </PaginationItem>
                        {paginationLinks}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-gray-800 font-medium cursor-pointer ${
                              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-100'
                            } transition-all duration-150`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}