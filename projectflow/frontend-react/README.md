# ProjectFlow React Frontend

This is the React frontend for Phase 3 of ProjectFlow.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:5173
```

## API Base URL Configuration

The app reads the backend API URL from `VITE_API_BASE_URL`.

1. Copy `.env.example` to `.env`.
2. Update the value if your Flask API is not running on `127.0.0.1:5000`.

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Project Structure

```text
frontend-react/
	src/
		components/
			HomePage.jsx
			HomePage.css
		config/
			api.js
		App.jsx
		main.jsx
```
