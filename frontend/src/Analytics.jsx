import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlAnalytics } from './api';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

export default function Analytics() {
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getUrlAnalytics(shortCode);
        setAnalytics(response.data);
      } catch (err) {
        console.error('Analytics error:', err.response);
        setError(err.response?.data?.error || 'Failed to load analytics');
      }
    };
    fetchAnalytics();
  }, [shortCode]);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
      <p className="text-red-400 text-xl font-semibold bg-white/90 p-6 rounded-lg shadow-lg">Error: {error}</p>
    </div>
  );
  if (!analytics) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
      <p className="text-white text-xl font-semibold bg-white/90 p-6 rounded-lg shadow-lg">Loading analytics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 flex items-center justify-center">
      <Card className="max-w-4xl w-full bg-white/90 shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
          <CardTitle className="text-4xl font-extrabold text-white text-center drop-shadow-lg">
            TinyLane
          </CardTitle>
          <p className="text-xl font-semibold text-white text-center mt-2">
            Analytics for <span className="text-yellow-300">{analytics.short_url}</span>
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-100/80 rounded-lg shadow-sm hover:bg-gray-200/80 transition-colors duration-200">
              <p className="text-sm font-semibold text-gray-800">Original URL:</p>
              <a
                href={analytics.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline break-all font-medium"
              >
                {analytics.original_url}
              </a>
            </div>
            <div className="p-4 bg-gray-100/80 rounded-lg shadow-sm hover:bg-gray-200/80 transition-colors duration-200">
              <p className="text-sm font-semibold text-gray-800">Short URL:</p>
              <a
                href={analytics.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline font-medium"
              >
                {analytics.short_url}
              </a>
            </div>
            <div className="p-4 bg-gray-100/80 rounded-lg shadow-sm hover:bg-gray-200/80 transition-colors duration-200">
              <p className="text-sm font-semibold text-gray-800">Created At:</p>
              <p className="text-gray-700">{new Date(analytics.created_at).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-100/80 rounded-lg shadow-sm hover:bg-gray-200/80 transition-colors duration-200">
              <p className="text-sm font-semibold text-gray-800">Expires At:</p>
              <p className="text-gray-700">
                {analytics.expires_at ? new Date(analytics.expires_at).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xl font-semibold text-gray-800 mb-4">Total Clicks: <span className="text-indigo-600">{analytics.clicks.length}</span></p>
            {analytics.clicks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No clicks recorded yet.</p>
            ) : (
              <Table className="bg-white/80 rounded-lg shadow-md">
                <TableHeader>
                  <TableRow className="bg-gray-200/80">
                    <TableHead className="text-gray-800 font-semibold">IP Address</TableHead>
                    <TableHead className="text-gray-800 font-semibold">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.clicks.map((click, index) => (
                    <TableRow key={index} className="hover:bg-gray-100/80 transition-colors duration-200">
                      <TableCell className="text-gray-700 font-medium">{click.ip_address}</TableCell>
                      <TableCell className="text-gray-700">{new Date(click.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}