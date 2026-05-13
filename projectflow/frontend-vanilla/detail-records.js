const API_PORT_CANDIDATES = [5000, 5001, 5002, 5003, 5004, 5005];
const DETAIL_ENDPOINT = '/api/tasks';
const MASTER_ENDPOINT = '/api/projects';
const HEALTH_ENDPOINT = '/api/health';
let apiBaseUrl = null;
let masterRecords = [];

const refreshBtn = document.getElementById('refreshBtn');
const createForm = document.getElementById('createForm');
const createSubmitBtn = document.getElementById('createSubmitBtn');
const createProjectId = document.getElementById('createProjectId');
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

function buildMasterOptions(records, selectedId = '') {
    const selectedValue = String(selectedId || '');
    const options = ['<option value="">Select a master project</option>'];

    for (const record of records) {
        const value = String(record.project_id);
        const selectedAttr = value === selectedValue ? ' selected' : '';
        options.push(
            `<option value="${escapeHtml(value)}"${selectedAttr}>${escapeHtml(record.project_name || `Project ${value}`)}</option>`
        );
    }

    return options.join('');
}

function refreshMasterSelects(records) {
    createProjectId.innerHTML = buildMasterOptions(records);
}

function getTaskPayloadFromForm(form) {
    const formData = new FormData(form);
    const projectIdRaw = String(formData.get('project_id') || '').trim();

    return {
        project_id: projectIdRaw ? Number(projectIdRaw) : NaN,
        task_title: String(formData.get('task_title') || '').trim(),
        task_description: String(formData.get('task_description') || '').trim(),
        priority: String(formData.get('priority') || '').trim(),
        status: String(formData.get('status') || '').trim(),
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
            const taskId = escapeHtml(task.task_id);
            const taskTitle = escapeHtml(task.task_title || 'Untitled Task');
            const taskDescription = escapeHtml(task.task_description || '');
            const priority = escapeHtml(task.priority || 'Unknown');
            const status = escapeHtml(task.status || 'Unknown');
            const dueDate = escapeHtml(task.due_date || 'Not set');
            const description = task.task_description && String(task.task_description).trim()
                ? `<p class="record-desc">${taskDescription}</p>`
                : '<p class="record-desc">No description</p>';

            const optionMarkup = buildMasterOptions(masterRecords, projectId);

            return `
                <article class="record-card">
                    <h2>${taskTitle}</h2>
                    <p class="record-meta">Task ID: ${taskId}</p>
                    <p class="record-meta">Connected Master: ${escapeHtml(projectName)} (ID: ${escapeHtml(projectId)})</p>
                    <p class="record-meta">Due Date: ${dueDate}</p>
                    <span class="pill pill-priority">Priority: ${priority}</span>
                    <span class="pill pill-status">Status: ${status}</span>
                    ${description}

                    <div class="card-actions">
                        <button class="btn btn-secondary edit-toggle-btn" type="button" data-task-id="${taskId}">Edit Detail</button>
                        <form class="inline-form delete-form" data-task-id="${taskId}">
                            <button class="btn btn-danger" type="submit">Delete Detail</button>
                        </form>
                    </div>

                    <form class="edit-form" data-task-id="${taskId}" hidden>
                        <div class="form-grid">
                            <div class="field">
                                <label>Connected Master *</label>
                                <select name="project_id" required>${optionMarkup}</select>
                            </div>

                            <div class="field">
                                <label>Task Title *</label>
                                <input name="task_title" type="text" value="${taskTitle}" required>
                            </div>

                            <div class="field">
                                <label>Priority *</label>
                                <input name="priority" type="text" value="${priority}" required>
                            </div>

                            <div class="field">
                                <label>Status *</label>
                                <input name="status" type="text" value="${status}" required>
                            </div>

                            <div class="field">
                                <label>Due Date</label>
                                <input name="due_date" type="date" value="${escapeHtml(task.due_date || '')}">
                            </div>
                        </div>

                        <div class="field">
                            <label>Task Description</label>
                            <textarea name="task_description">${taskDescription}</textarea>
                        </div>

                        <div class="form-actions">
                            <button class="btn btn-primary" type="submit">Save Changes</button>
                            <button class="btn btn-secondary cancel-edit-btn" type="button" data-task-id="${taskId}">Cancel</button>
                        </div>
                    </form>
                </article>
            `;
        })
        .join('');
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
            requestJson(`${apiBaseUrl}${DETAIL_ENDPOINT}`),
            requestJson(`${apiBaseUrl}${MASTER_ENDPOINT}`).catch(() => [])
        ]);

        masterRecords = Array.isArray(projects) ? projects : [];
        refreshMasterSelects(masterRecords);
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

function closeAllEditForms() {
    recordsGrid.querySelectorAll('.edit-form').forEach((form) => {
        form.hidden = true;
    });
}

function validateTaskPayload(payload) {
    if (!Number.isFinite(payload.project_id)) {
        return 'Please select a connected master project.';
    }
    if (!payload.task_title || !payload.priority || !payload.status) {
        return 'Task title, priority, and status are required.';
    }
    return '';
}

async function handleCreateSubmit(event) {
    event.preventDefault();

    if (!apiBaseUrl) {
        setMessage('error', 'Backend is not available. Start the backend and refresh.');
        return;
    }

    const payload = getTaskPayloadFromForm(createForm);
    const validationError = validateTaskPayload(payload);

    if (validationError) {
        setMessage('error', validationError);
        return;
    }

    createSubmitBtn.disabled = true;
    setStatus('Creating detail record...');

    try {
        const created = await requestJson(`${apiBaseUrl}${DETAIL_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        createForm.reset();
        refreshMasterSelects(masterRecords);
        await fetchDetailRecords();
        setMessage('info', `Created detail record: ${created.task_title}.`);
    } catch (error) {
        setMessage('error', `Unable to create detail record. ${error.message}`);
        setStatus('Create failed.');
    } finally {
        createSubmitBtn.disabled = false;
    }
}

function handleGridClick(event) {
    const editToggleBtn = event.target.closest('.edit-toggle-btn');
    if (editToggleBtn) {
        const taskId = editToggleBtn.dataset.taskId;
        const editForm = recordsGrid.querySelector(`.edit-form[data-task-id="${taskId}"]`);

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
        const taskId = cancelBtn.dataset.taskId;
        const editForm = recordsGrid.querySelector(`.edit-form[data-task-id="${taskId}"]`);
        if (editForm) {
            editForm.hidden = true;
        }
    }
}

async function handleGridSubmit(event) {
    const deleteForm = event.target.closest('.delete-form');
    if (deleteForm) {
        event.preventDefault();

        const taskId = deleteForm.dataset.taskId;
        if (!window.confirm(`Delete task #${taskId}?`)) {
            return;
        }

        const deleteBtn = deleteForm.querySelector('button[type="submit"]');
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }

        setStatus(`Deleting task #${taskId}...`);

        try {
            await requestJson(`${apiBaseUrl}${DETAIL_ENDPOINT}/${taskId}`, {
                method: 'DELETE'
            });

            await fetchDetailRecords();
            setMessage('info', `Deleted detail record #${taskId}.`);
        } catch (error) {
            setMessage('error', `Unable to delete detail record #${taskId}. ${error.message}`);
            setStatus('Delete failed.');
        } finally {
            if (deleteBtn) {
                deleteBtn.disabled = false;
            }
        }
        return;
    }

    const editForm = event.target.closest('.edit-form');
    if (editForm) {
        event.preventDefault();

        const taskId = editForm.dataset.taskId;
        const payload = getTaskPayloadFromForm(editForm);
        const validationError = validateTaskPayload(payload);

        if (validationError) {
            setMessage('error', validationError);
            return;
        }

        const saveBtn = editForm.querySelector('button[type="submit"]');
        if (saveBtn) {
            saveBtn.disabled = true;
        }

        setStatus(`Updating task #${taskId}...`);

        try {
            const updated = await requestJson(`${apiBaseUrl}${DETAIL_ENDPOINT}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            await fetchDetailRecords();
            setMessage('info', `Updated detail record: ${updated.task_title}.`);
        } catch (error) {
            setMessage('error', `Unable to update detail record #${taskId}. ${error.message}`);
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
    refreshBtn.addEventListener('click', fetchDetailRecords);
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

    apiPath.textContent = `${apiBaseUrl}${DETAIL_ENDPOINT}`;
    fetchDetailRecords();
}

document.addEventListener('DOMContentLoaded', initializePage);
