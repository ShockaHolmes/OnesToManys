const API_PORT_CANDIDATES = [5000, 5001, 5002, 5003, 5004, 5005];
const MASTER_ENDPOINT = '/api/projects';
const HEALTH_ENDPOINT = '/api/health';
let apiBaseUrl = null;

const refreshBtn = document.getElementById('refreshBtn');
const apiPath = document.getElementById('apiPath');
const statusText = document.getElementById('statusText');
const messageBox = document.getElementById('messageBox');
const recordsGrid = document.getElementById('recordsGrid');
const lastUpdated = document.getElementById('lastUpdated');

function setStatus(text) {
    statusText.textContent = text;
}

function setMessage(type, text) {
    if (!text) {
        messageBox.className = 'message';
        messageBox.textContent = '';
        return;
    }

    messageBox.className = `message ${type}`;
    messageBox.textContent = text;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderRecords(records) {
    if (!Array.isArray(records) || records.length === 0) {
        recordsGrid.innerHTML = '';
        setMessage('info', 'No master records were returned by the API.');
        return;
    }

    setMessage('', '');

    recordsGrid.innerHTML = records
        .map((project) => {
            const description = project.description && String(project.description).trim()
                ? `<p class="record-desc">${escapeHtml(project.description)}</p>`
                : '<p class="record-desc">No description</p>';

            return `
                <article class="record-card">
                    <h2>${escapeHtml(project.project_name || 'Untitled Project')}</h2>
                    <p class="record-meta">Project ID: ${escapeHtml(project.project_id)}</p>
                    <span class="status-chip">${escapeHtml(project.status || 'Unknown')}</span>
                    ${description}
                </article>
            `;
        })
        .join('');
}

async function fetchMasterRecords() {
    if (!apiBaseUrl) {
        setMessage('error', 'No reachable backend was found. Start the Flask server and refresh.');
        setStatus('Backend unavailable.');
        return;
    }

    refreshBtn.disabled = true;
    setStatus('Loading master records...');
    setMessage('info', 'Loading records from the API...');

    try {
        const response = await fetch(`${apiBaseUrl}${MASTER_ENDPOINT}`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        renderRecords(data);

        const now = new Date();
        lastUpdated.textContent = now.toLocaleString();
        setStatus(`Loaded ${Array.isArray(data) ? data.length : 0} master records.`);
    } catch (error) {
        console.error('Failed to fetch master records:', error);
        recordsGrid.innerHTML = '';
        setMessage('error', `Unable to fetch master records. ${error.message}`);
        setStatus('Error loading master records.');
    } finally {
        refreshBtn.disabled = false;
    }
}

async function isBackendHealthy(baseUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
        const response = await fetch(`${baseUrl}${HEALTH_ENDPOINT}`, {
            signal: controller.signal
        });
        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function detectBackendUrl() {
    for (const port of API_PORT_CANDIDATES) {
        const candidate = `http://localhost:${port}`;
        const healthy = await isBackendHealthy(candidate);
        if (healthy) {
            return candidate;
        }
    }
    return null;
}

async function initializePage() {
    refreshBtn.addEventListener('click', fetchMasterRecords);

    setStatus('Detecting backend...');
    setMessage('info', 'Checking localhost ports for the Flask API...');
    apiBaseUrl = await detectBackendUrl();

    if (!apiBaseUrl) {
        apiPath.textContent = 'Not found';
        setMessage('error', 'Could not detect backend on localhost:5000-5005. Start the backend and refresh.');
        setStatus('Backend not detected.');
        return;
    }

    apiPath.textContent = `${apiBaseUrl}${MASTER_ENDPOINT}`;
    fetchMasterRecords();
}

document.addEventListener('DOMContentLoaded', initializePage);
