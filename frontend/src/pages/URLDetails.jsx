import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getURLDetails } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function URLDetails() {
  const { shortCode } = useParams();
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getURLDetails(shortCode, token);
        setUrl(response.data);
      } catch (err) {
        console.error('Failed to load URL details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [shortCode, token]);

  if (loading) return <p className="text-center dark:text-white">Loading...</p>;
  if (!url) return <p className="text-center text-red-500">URL not found</p>;

  const avgRedirectionTime = url.clicks.length > 0
    ? (url.clicks.reduce((sum, click) => sum + click.redirection_time, 0) / url.clicks.length).toFixed(2)
    : 'N/A';

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">URL Details</h1>
      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-300">{url.short_code}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Original URL:</strong> <a href={url.original_url} target="_blank" className="text-blue-500 hover:underline">{url.original_url}</a></p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Total Clicks:</strong> {url.click_count}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Total Unique Clicks:</strong> {new Set(url.clicks.map(c => c.ip_address)).size}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Short Code:</strong> {url.short_code}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Creation Date:</strong> {new Date(url.created_at).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Average Redirection Time:</strong> {avgRedirectionTime} ms</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Last Click:</strong> {url.clicks.length > 0 ? new Date(url.clicks[0].timestamp).toLocaleString() : 'N/A'}</p>
          </div>
          {url.clicks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Click Details</h3>
              <ul className="space-y-2">
                {url.clicks.map((click, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(click.timestamp).toLocaleString()} - IP: {click.ip_address} - {click.redirection_time} ms
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}