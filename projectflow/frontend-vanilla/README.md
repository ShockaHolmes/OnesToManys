# ProjectFlow Frontend - Vanilla JavaScript

A lightweight, responsive web frontend for ProjectFlow built with pure HTML, CSS, and Vanilla JavaScript. No frameworks or dependencies required!

## 📁 Project Structure

```
frontend-vanilla/
├── index.html      # Main HTML page
├── master-records.html  # Master records (projects) listing page
├── detail-records.html  # Detail records (tasks) listing page
├── styles.css      # Styling (CSS)
├── script.js       # Application logic (JavaScript)
├── master-records.js # Master records page logic
├── detail-records.js # Detail records page logic
└── README.md       # This file
```

## 🚀 Getting Started

### One-Click Start (macOS)

From the `projectflow` folder, double-click `Start-ProjectFlow.command`.

It will launch both services together and open:
- `http://127.0.0.1:5000/api/health` (backend)
- `http://localhost:8000/index.html` (frontend)

If macOS warns the first time, right-click `Start-ProjectFlow.command` and choose **Open**.

### One-Click Stop (macOS)

From the `projectflow` folder, double-click `Stop-ProjectFlow.command` to stop both backend and frontend services.

### Prerequisites

- **Backend Server Running**: The Flask backend must be running on localhost (master-records auto-detects ports `5000-5005`)
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (ES6 support required)
- **No installation needed**: This is a static frontend with no build process!

### Quick Start

#### 1. Start the Backend Server

```bash
cd projectflow/backend
python3 app.py
```

The backend will start running at `http://localhost:5000` (or the next available port if 5000 is busy).

#### 2. Open the Frontend

**Option A: Using a Simple HTTP Server**

```bash
cd projectflow/frontend-vanilla
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

**Option B: Direct File Opening**

Simply double-click `index.html` or open it directly in your browser:
```
file:///Users/shocka/Projects/OnesToManys/projectflow/frontend-vanilla/index.html
```

**Option C: Using Node.js HTTP Server**

```bash
cd projectflow/frontend-vanilla
npx http-server
```

Then open `http://localhost:8080`

### 3. Start Using the App

1. ✅ The app will automatically check for backend connectivity
2. 📦 Create a new project using the "+ New Project" button
3. ✏️ Add tasks to your project with "+ New Task"
4. 🎯 Manage your tasks by editing or deleting them

### Master Records Page (Phase 3)

Open `master-records.html` to view all master records (projects) from the REST API.

You can also open it from `index.html` using the **Phase 3: One-to-Many Viewer (Master -> Details)** link in the header.

This page includes:
- Dynamic rendering of records from `GET /api/projects`
- Select a master record and load related detail records from `GET /api/projects/{id}/tasks`
- Dynamic detail list updates when another master record is selected
- Loading state while data is being fetched
- Error state when the API request fails
- Manual refresh via a "Refresh Data" button
- Automatic backend detection on `http://localhost:5000` through `http://localhost:5005`

### Detail Records Page (Phase 3)

Open `detail-records.html` to view all detail records (tasks) from the REST API.

You can also open it from `index.html` using the **View All Detail Records** link in the header.

This page includes:
- Dynamic rendering of records from `GET /api/tasks`
- Connected master information for each detail (project ID and project name when available)
- Loading state while data is being fetched
- Error state when the API request fails
- Manual refresh via a "Refresh Data" button
- Automatic backend detection on `http://localhost:5000` through `http://localhost:5005`

## 🎯 Features

### Projects Management
- ✅ View all projects in a responsive grid
- ✅ Create new projects with name, description, and status
- ✅ Delete projects (with confirmation)
- ✅ Visual status indicators (Planning, In Progress, On Hold, Completed)
- ✅ Click to select a project and view its tasks

### Tasks Management
- ✅ View tasks for selected project
- ✅ Create new tasks with title, description, priority, and due date
- ✅ Set task status (To Do, In Progress, Done)
- ✅ Set task priority (Low, Medium, High)
- ✅ Delete tasks
- ✅ Visual priority and status badges

### User Experience
- ✅ Real-time toast notifications for actions
- ✅ Status bar showing current operations
- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ Keyboard-friendly with proper form handling
- ✅ Backend connection status indicator
- ✅ Input validation and error handling

## 🎨 Design Highlights

### Color Scheme
- **Primary Blue**: #3b82f6 (buttons, highlights)
- **Success Green**: #10b981 (confirmations)
- **Danger Red**: #ef4444 (deletions)
- **Warning Orange**: #f59e0b (alerts)

### Responsive Breakpoints
- Desktop: Full grid layout with 2 columns
- Tablet (768px): Single column layout
- Mobile (480px): Optimized mobile interface

### Typography
- Modern system font stack for better performance
- Clear hierarchy with appropriate sizing
- Good contrast ratios for accessibility

## 📝 API Endpoints Used

The frontend connects to these backend API endpoints:

### Health Check
```
GET /api/health
```

### Projects
```
GET    /api/projects                    # List all projects
POST   /api/projects                    # Create new project
DELETE /api/projects/<project_id>       # Delete project
PUT    /api/projects/<project_id>       # Update project
```

### Tasks
```
GET    /api/tasks                       # List all tasks
POST   /api/tasks                       # Create new task
DELETE /api/tasks/<task_id>             # Delete task
PUT    /api/tasks/<task_id>             # Update task
```

### Project Tasks
```
GET    /api/projects/<project_id>/tasks # Get tasks for project
POST   /api/projects/<project_id>/tasks # Create task for project
```

## 🔧 Configuration

### Changing Backend URL

If your backend is running on a different port or hostname, edit the first line of `script.js`:

```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:5000';

// To your actual backend URL:
const API_BASE_URL = 'http://your-backend-url:port';
```

### Master Records Backend Detection

`master-records.js` automatically checks localhost ports `5000` through `5005` using `GET /api/health` and picks the first reachable backend.

If your backend runs outside that range, edit `API_PORT_CANDIDATES` in `master-records.js`.

### Detail Records Backend Detection

`detail-records.js` automatically checks localhost ports `5000` through `5005` using `GET /api/health` and picks the first reachable backend.

If your backend runs outside that range, edit `API_PORT_CANDIDATES` in `detail-records.js`.

## 🐛 Troubleshooting

### Backend Connection Error

**Error**: "Cannot connect to backend at http://localhost:5000"

**Solutions**:
1. Make sure Flask backend is running: `python3 app.py` in the backend directory
2. Check the port number (default is 5000, but may use 5001, 5002, etc. if 5000 is busy)
3. For `master-records.html`, no manual change is needed if backend is on localhost `5000-5005`
4. For `detail-records.html`, no manual change is needed if backend is on localhost `5000-5005`
5. For `index.html`, update `API_BASE_URL` in `script.js` if needed
6. Ensure CORS is enabled in Flask (it is by default)

### Projects/Tasks Not Loading

**Solutions**:
1. Refresh the page (Ctrl+R or Cmd+R)
2. Open browser console (F12) to check for errors
3. Verify the database file exists at `projectflow/database/projectflow.db`
4. Check that the backend is responding to health check

### Styling Looks Wrong

**Solutions**:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Ensure all files (HTML, CSS, JS) are in the same directory

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: Older browsers may not support ES6 features like async/await and fetch API.

## 🎓 Learning Resources

### JavaScript Files Overview

**`index.html`**
- Semantic HTML5 structure
- Form for creating projects and tasks
- Containers for displaying data
- Toast notification system

**`styles.css`**
- CSS Variables for theming
- CSS Grid and Flexbox layouts
- Responsive mobile-first design
- Smooth animations and transitions

**`script.js`**
- Fetch API for backend communication
- DOM manipulation and event handling
- Form validation and error handling
- XSS prevention with HTML escaping
- Modular function organization

## 🚀 Deployment

### Deploy to Netlify (Static Hosting)

1. Create a `netlify.toml` file:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy the `frontend-vanilla` directory

3. Update `API_BASE_URL` to point to your production backend

### Deploy to GitHub Pages

1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Update `API_BASE_URL` accordingly

## 📦 What's Included

- ✅ Multiple pages and scripts (`index.html`, `master-records.html`, `script.js`, `master-records.js`, `styles.css`)
- ✅ No external dependencies
- ✅ No build process required
- ✅ ~30KB total file size
- ✅ Fully functional frontend
- ✅ Professional UI/UX

## 📖 Code Examples

### Creating a Project

```javascript
const projectData = {
    project_name: "My Project",
    description: "Project description",
    status: "In Progress"
};

await apiCall('/api/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
});
```

### Fetching Projects

```javascript
const projects = await apiCall('/api/projects');
renderProjects(projects);
```

### Adding Event Listeners

```javascript
projectForm.addEventListener('submit', createProject);
newProjectBtn.addEventListener('click', () => {
    projectForm.classList.toggle('hidden');
});
```

## 🤝 Contributing

To enhance this frontend:

1. **Add inline filtering and sorting**: Filter and sort projects/tasks by status and priority
2. **Add filtering**: Filter projects by status
3. **Add search**: Search projects and tasks
4. **Add due date indicators**: Show overdue tasks
5. **Add dark mode**: Toggle dark/light theme
6. **Add statistics**: Show project/task counts
7. **Add drag-drop**: Rearrange task priorities
8. **Add localStorage**: Cache data locally

## ✨ Future Enhancements

- [ ] Filter and search functionality
- [ ] Local storage for offline support
- [ ] Dark mode theme
- [ ] Drag and drop interface
- [ ] Task categorization/tagging
- [ ] Project templates
- [ ] User authentication
- [ ] Export/import data

## 📄 License

This project is part of the OnesToManys repository.

## 🆘 Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify the backend is running and accessible
3. Check that all files are in the correct directory
4. Ensure your browser supports ES6
5. Try clearing cache and hard refreshing

---

**Happy project managing! 🎉**
