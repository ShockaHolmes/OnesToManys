const API_PORT_CANDIDATES = [5000, 5001, 5002, 5003, 5004, 5005];
const DETAIL_ENDPOINT = '/api/tasks';
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

function buildMasterNameMap(projects) {
    if (!Array.isArray(projects)) {
        return new Map();
    }

    return new Map(
        projects
            .filter((project) => project && project.project_id !== undefined)
            .map((project) => [String(project.project_id), project.project_name || 'Unnamed Project'])
    );
}

function renderRecords(tasks, masterNameMap) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        recordsGrid.innerHTML = '';
        setMessage('info', 'No detail records were returned by the API.');
        return;
    }

    setMessage('', '');

    recordsGrid.innerHTML = tasks
        .map((task) => {
            const projectId = task.project_id !== undefined ? String(task.project_id) : 'Unknown';
            const projectName = masterNameMap.get(projectId) || 'Unknown Project';
            const description = task.task_description && String(task.task_description).trim()
                ? `<p class="record-desc">${escapeHtml(task.task_description)}</p>`
                : '<p class="record-desc">No description</p>';

            return `
                <article class="record-card">
                    <h2>${escapeHtml(task.task_title || 'Untitled Task')}</h2>
                    <p class="record-meta">Task ID: ${escapeHtml(task.task_id)}</p>
                    <p class="record-meta">Connected Master: ${escapeHtml(projectName)} (ID: ${escapeHtml(projectId)})</p>
                    <span class="pill pill-priority">Priority: ${escapeHtml(task.priority || 'Unknown')}</span>
                    <span class="pill pill-status">Status: ${escapeHtml(task.status || 'Unknown')}</span>
                    ${description}
                </article>
            `;
        })
        .join('');
}

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

async function fetchDetailRecords() {
    if (!apiBaseUrl) {
        setMessage('error', 'No reachable backend was found. Start the Flask server and refresh.');
        setStatus('Backend unavailable.');
        return;
    }

    refreshBtn.disabled = true;
    setStatus('Loading detail records...');
    setMessage('info', 'Loading tasks and connected projects from the API...');

    try {
        const [tasks, projects] = await Promise.all([
            fetchJson(`${apiBaseUrl}${DETAIL_ENDPOINT}`),
            fetchJson(`${apiBaseUrl}${MASTER_ENDPOINT}`).catch(() => [])
        ]);

        const masterNameMap = buildMasterNameMap(projects);
        renderRecords(tasks, masterNameMap);

        const now = new Date();
        lastUpdated.textContent = now.toLocaleString();
        setStatus(`Loaded ${Array.isArray(tasks) ? tasks.length : 0} detail records.`);
    } catch (error) {
        console.error('Failed to fetch detail records:', error);
        recordsGrid.innerHTML = '';
        setMessage('error', `Unable to fetch detail records. ${error.message}`);
        setStatus('Error loading detail records.');
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
    refreshBtn.addEventListener('click', fetchDetailRecords);

    setStatus('Detecting backend...');
    setMessage('info', 'Checking localhost ports for the Flask API...');
    apiBaseUrl = await detectBackendUrl();

    if (!apiBaseUrl) {
        apiPath.textContent = 'Not found';
        setMessage('error', 'Could not detect backend on localhost:5000-5005. Start the backend and refresh.');
        setStatus('Backend not detected.');
        return;
    }

    apiPath.textContent = `${apiBaseUrl}${DETAIL_ENDPOINT}`;
    fetchDetailRecords();
}

document.addEventListener('DOMContentLoaded', initializePage);
