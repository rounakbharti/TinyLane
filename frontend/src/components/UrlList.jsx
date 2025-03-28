import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function UrlList({ urls }) {
  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <Card key={url.short_code} className="shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
              <Link to={`/url/${url.short_code}`} className="hover:underline">
                {url.short_code}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{url.original_url}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Clicks: {url.click_count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}