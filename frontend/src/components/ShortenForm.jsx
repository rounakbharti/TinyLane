import { useState } from 'react';
import { shortenURL } from '../api';
import { Input, Button, Label, Card, CardContent } from "@/components/ui";

export default function ShortenForm({ onShortened }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await shortenURL({ original_url: originalUrl, expires_at: expiresAt }, token);
      onShortened(response.data);
      setOriginalUrl('');
      setExpiresAt('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url" className="text-gray-700 dark:text-gray-300">Long URL</Label>
            <Input id="url" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="https://example.com" required className="border-gray-200 dark:border-gray-700" />
          </div>
          <div>
            <Label htmlFor="expires" className="text-gray-700 dark:text-gray-300">Expiration Date (optional)</Label>
            <Input id="expires" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="border-gray-200 dark:border-gray-700" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white">
            {loading ? 'Shortening...' : 'Shorten'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}