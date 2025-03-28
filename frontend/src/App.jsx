import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">URL Shortener</h1>
      <Link to="/shorten" className="text-blue-500 hover:underline">
        Shorten a URL
      </Link>
    </div>
  );
}