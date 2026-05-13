const API_PORT_CANDIDATES = [5000, 5001, 5002, 5003, 5004, 5005];
const MASTER_ENDPOINT = '/api/projects';
const HEALTH_ENDPOINT = '/api/health';
let apiBaseUrl = null;

const refreshBtn = document.getElementById('refreshBtn');
const createForm = document.getElementById('createForm');
const createSubmitBtn = document.getElementById('createSubmitBtn');
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

function normalizeDateInput(value) {
    return value && String(value).trim() ? String(value).trim() : '';
}

function getPayloadFromForm(form) {
    const formData = new FormData(form);

    return {
        project_name: String(formData.get('project_name') || '').trim(),
        status: String(formData.get('status') || '').trim(),
        description: String(formData.get('description') || '').trim(),
        start_date: normalizeDateInput(formData.get('start_date')),
        due_date: normalizeDateInput(formData.get('due_date'))
    };
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    let payload = null;

    if (contentType.includes('application/json')) {
        payload = await response.json();
    }

    if (!response.ok) {
        const backendMessage = payload && (payload.error || payload.message);
        throw new Error(backendMessage || `Request failed with status ${response.status}`);
    }

    return payload;
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
            const projectId = escapeHtml(project.project_id);
            const projectName = escapeHtml(project.project_name || 'Untitled Project');
            const status = escapeHtml(project.status || 'Unknown');
            const startDate = escapeHtml(project.start_date || 'Not set');
            const dueDate = escapeHtml(project.due_date || 'Not set');
            const safeDescription = escapeHtml(project.description || '');
            const description = project.description && String(project.description).trim()
                ? `<p class="record-desc">${safeDescription}</p>`
                : '<p class="record-desc">No description</p>';

            return `
                <article class="record-card">
                    <h2>${projectName}</h2>
                    <p class="record-meta">Project ID: ${projectId}</p>
                    <p class="record-meta">Start: ${startDate} | Due: ${dueDate}</p>
                    <span class="status-chip">${status}</span>
                    ${description}

                    <div class="card-actions">
                        <button class="btn btn-secondary edit-toggle-btn" type="button" data-project-id="${projectId}">Edit</button>
                        <form class="inline-form delete-form" data-project-id="${projectId}">
                            <button class="btn btn-danger" type="submit">Delete</button>
                        </form>
                    </div>

                    <form class="edit-form" data-project-id="${projectId}" hidden>
                        <div class="form-grid">
                            <div class="field">
                                <label>Project Name *</label>
                                <input name="project_name" type="text" value="${projectName}" required>
                            </div>

                            <div class="field">
                                <label>Status *</label>
                                <input name="status" type="text" value="${status}" required>
                            </div>

                            <div class="field">
                                <label>Start Date</label>
                                <input name="start_date" type="date" value="${escapeHtml(project.start_date || '')}">
                            </div>

                            <div class="field">
                                <label>Due Date</label>
                                <input name="due_date" type="date" value="${escapeHtml(project.due_date || '')}">
                            </div>
                        </div>

                        <div class="field">
                            <label>Description</label>
                            <textarea name="description">${safeDescription}</textarea>
                        </div>

                        <div class="form-actions">
                            <button class="btn btn-primary" type="submit">Save Changes</button>
                            <button class="btn btn-secondary cancel-edit-btn" type="button" data-project-id="${projectId}">Cancel</button>
                        </div>
                    </form>
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
        const data = await requestJson(`${apiBaseUrl}${MASTER_ENDPOINT}`);
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

function closeAllEditForms() {
    recordsGrid.querySelectorAll('.edit-form').forEach((form) => {
        form.hidden = true;
    });
}

async function handleCreateSubmit(event) {
    event.preventDefault();

    if (!apiBaseUrl) {
        setMessage('error', 'Backend is not available. Start the backend and refresh.');
        return;
    }

    const payload = getPayloadFromForm(createForm);

    if (!payload.project_name || !payload.status) {
        setMessage('error', 'Project name and status are required.');
        return;
    }

    createSubmitBtn.disabled = true;
    setStatus('Creating master record...');

    try {
        const created = await requestJson(`${apiBaseUrl}${MASTER_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        createForm.reset();
        await fetchMasterRecords();
        setMessage('info', `Created master record: ${created.project_name}.`);
    } catch (error) {
        setMessage('error', `Unable to create record. ${error.message}`);
        setStatus('Create failed.');
    } finally {
        createSubmitBtn.disabled = false;
    }
}

function handleGridClick(event) {
    const editToggleBtn = event.target.closest('.edit-toggle-btn');
    if (editToggleBtn) {
        const projectId = editToggleBtn.dataset.projectId;
        const editForm = recordsGrid.querySelector(`.edit-form[data-project-id="${projectId}"]`);

        if (!editForm) {
            return;
        }

        const willShow = editForm.hidden;
        closeAllEditForms();
        editForm.hidden = !willShow;
        return;
    }

    const cancelBtn = event.target.closest('.cancel-edit-btn');
    if (cancelBtn) {
        const projectId = cancelBtn.dataset.projectId;
        const editForm = recordsGrid.querySelector(`.edit-form[data-project-id="${projectId}"]`);
        if (editForm) {
            editForm.hidden = true;
        }
    }
}

async function handleGridSubmit(event) {
    const deleteForm = event.target.closest('.delete-form');
    if (deleteForm) {
        event.preventDefault();

        const projectId = deleteForm.dataset.projectId;
        if (!window.confirm(`Delete project #${projectId}? This also deletes related tasks.`)) {
            return;
        }

        const submitBtn = deleteForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        setStatus(`Deleting project #${projectId}...`);

        try {
            await requestJson(`${apiBaseUrl}${MASTER_ENDPOINT}/${projectId}`, {
                method: 'DELETE'
            });
            await fetchMasterRecords();
            setMessage('info', `Deleted master record #${projectId}.`);
        } catch (error) {
            setMessage('error', `Unable to delete record #${projectId}. ${error.message}`);
            setStatus('Delete failed.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
        return;
    }

    const editForm = event.target.closest('.edit-form');
    if (editForm) {
        event.preventDefault();

        const projectId = editForm.dataset.projectId;
        const payload = getPayloadFromForm(editForm);

        if (!payload.project_name || !payload.status) {
            setMessage('error', 'Project name and status are required for updates.');
            return;
        }

        const saveBtn = editForm.querySelector('button[type="submit"]');
        if (saveBtn) {
            saveBtn.disabled = true;
        }

        setStatus(`Updating project #${projectId}...`);

        try {
            const updated = await requestJson(`${apiBaseUrl}${MASTER_ENDPOINT}/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            await fetchMasterRecords();
            setMessage('info', `Updated master record: ${updated.project_name}.`);
        } catch (error) {
            setMessage('error', `Unable to update record #${projectId}. ${error.message}`);
            setStatus('Update failed.');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
            }
        }
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
    createForm.addEventListener('submit', handleCreateSubmit);
    recordsGrid.addEventListener('click', handleGridClick);
    recordsGrid.addEventListener('submit', handleGridSubmit);

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
