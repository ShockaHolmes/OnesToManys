import { API_BASE_URL, apiPath } from '../config/api'
import ProjectTaskDashboard from './ProjectTaskDashboard'
import './HomePage.css'

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-card">
        <p className="phase-label">Phase 3 Frontend</p>
        <h1>ProjectFlow React Frontend</h1>
        <p className="summary">
          This React app is ready for local development and wired to the ProjectFlow Flask API.
        </p>
        <div className="api-banner">
          <span>API Base URL</span>
          <code>{API_BASE_URL}</code>
        </div>
        <div className="quick-links">
          <a href={apiPath('/api/health')} target="_blank" rel="noreferrer">
            API Health
          </a>
          <a href={apiPath('/api/projects')} target="_blank" rel="noreferrer">
            Projects Endpoint
          </a>
          <a href={apiPath('/api/tasks')} target="_blank" rel="noreferrer">
            Tasks Endpoint
          </a>
        </div>

        <ProjectTaskDashboard />
      </section>
    </main>
  )
}

export default HomePage