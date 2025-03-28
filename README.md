# TinyLane - URL Shortener

TinyLane is a URL shortening service similar to Bit.ly, designed to transform long URLs into short, unique links that redirect to the original URL. It offers features like click tracking, analytics, and expiration management, making it a powerful tool for users to manage and analyze their links.

## Objective
Build a URL shortener where users can:
- Enter a long URL and receive a short, unique URL (e.g., `tinylane.vercel.app/abc123`).
- Track clicks, analytics, and expiration times for each shortened URL.

## Tech Stack
- **Frontend**: React (Deployed on Vercel: [https://tinylane.vercel.app/](https://tinylane.vercel.app/))
- **Backend**: Python/Django with MySQL (Deployed on Render: [https://tinylane-backend.onrender.com/](https://tinylane-backend.onrender.com/))
- **Database**: MySQL (local development), PostgreSQL (Render production)
- **Background Tasks**: Celery with Redis for auto-deleting expired URLs

## Features
1. **URL Shortening**:
   - Users enter a long URL, and TinyLane generates a unique short URL (e.g., `tinylane.vercel.app/abc123`).
2. **URL History**:
   - Users can view their past shortened URLs with details including:
     - Original URL
     - Short URL
     - Creation date
     - Expiration date (if set)
     - **Status**: Active, Expired, or Deleted
3. **Click Tracking & Analytics**:
   - Logs each click with:
     - Number of times the link is accessed
     - Timestamp of each click
     - IP address of the visitor
4. **Expiration Management**:
   - Users can set an expiration date for short URLs.
   - Expired URLs are auto-deleted via a Celery background task.
5. **User-Friendly Interface**:
   - Simple React-based frontend for URL submission and history viewing.

## Project Structure
```
TinyLane/
├── frontend/           # React frontend code
│   ├── src/
│   └── package.json
├── backend/            # Django backend code
│   ├── backend/        # Django project settings
│   ├── shortener/      # Django app for URL logic
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (for frontend)
- Python 3.9+ (for backend)
- MySQL (local dev) or PostgreSQL (production)
- Redis (for Celery)
- Git

### Backend Setup (Local)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TinyLane.git
   cd TinyLane/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure MySQL:
   - Create a database: `url_shortener_db`
   - Update `backend/settings.py` with your MySQL credentials.
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (Local)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
   Runs on `http://localhost:5173`.

### Running Celery (Local)
1. Start Redis:
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```
2. Run Celery worker and beat:
   ```bash
   celery -A backend worker --loglevel=info
   celery -A backend beat --loglevel=info
   ```

## Deployment
- **Frontend**: Deployed on Vercel at [https://tinylane.vercel.app/](https://tinylane.vercel.app/)
- **Backend**: Deployed on Render at [https://tinylane-backend.onrender.com/](https://tinylane-backend.onrender.com/)
- Uses PostgreSQL and Redis managed services on Render.
- See `Procfile` for web, worker, and beat processes.

## Screenshots
Below are demo images showcasing TinyLane’s functionality:

- **Homepage**: Enter a long URL to shorten.
- **Short URL Generated**: See the unique short URL.
- **URL History**: View past URLs with status.
- **Analytics Overview**: Total clicks and basic stats.
- **Click Details**: Timestamp and IP address logs.
- **Set Expiration**: Option to add an expiration date.
- **Expired URL**: Status changes to "Expired".
- **Admin Panel**: Manage URLs and analytics (Django admin).

## Features in Action
- **Shortening**: Input `https://example.com/very/long/url` → Get `tinylane.vercel.app/abc123`.
- **History**: Displays all URLs with "Active," "Expired," or "Deleted" status.
- **Analytics**: Tracks clicks (e.g., 15 clicks, last at `2025-03-28 12:00 UTC` from IP `192.168.1.1`).
- **Expiration**: Set a date (e.g., `2025-04-01`), and Celery auto-deletes post-expiry.

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For issues or suggestions, open an issue on GitHub or reach out to `your-email@example.com`.

---
