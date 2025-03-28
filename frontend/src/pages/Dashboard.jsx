import { useEffect, useState } from 'react';
import { getMyURLs } from '../api';
import UrlList from '../components/UrlList';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const response = await getMyURLs();
        setUrls(response.data);
      } catch (err) {
        setError('Failed to load URLs. Are you logged in?');
      } finally {
        setLoading(false);
      }
    };
    fetchURLs();
  }, []);

  if (loading) return <p className="text-center dark:text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Your Shortened URLs</h1>
      <UrlList urls={urls} />
    </div>
  );
}