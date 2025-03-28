import { useState, useEffect } from 'react';
import ShortenForm from '../components/ShortenForm';
import UrlList from '../components/UrlList';
import { getMyURLs } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const response = await getMyURLs(token);
        setUrls(response.data);
      } catch (err) {
        console.error('Failed to load URLs');
      } finally {
        setLoading(false);
      }
    };
    fetchURLs();
  }, [token]);

  const handleShortened = (newUrl) => {
    setUrls([newUrl, ...urls]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Shorten Your URLs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-none border-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-300">Create New</CardTitle>
          </CardHeader>
          <CardContent>
            <ShortenForm onShortened={handleShortened} />
          </CardContent>
        </Card>
        <Card className="shadow-none border-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-300">Your URLs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : urls.length > 0 ? (
              <UrlList urls={urls} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No URLs yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}