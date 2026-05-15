const API_PORT_CANDIDATES = [5000, 5001, 5002, 5003, 5004, 5005];
const MASTER_ENDPOINT = '/api/projects';
const DETAIL_ENDPOINT = '/api/tasks';
const HEALTH_ENDPOINT = '/api/health';
let apiBaseUrl = null;
let currentProjects = [];
let currentTasks = [];
let selectedProjectId = null;
let selectedTaskId = null;
let expandedProjectIds = new Set();

const refreshBtn = document.getElementById('refreshBtn');
const toggleAllBtn = document.getElementById('toggleAllBtn');
const createForm = document.getElementById('createForm');
const createSubmitBtn = document.getElementById('createSubmitBtn');
const apiPath = document.getElementById('apiPath');
const statusText = document.getElementById('statusText');
const messageBox = document.getElementById('messageBox');
const recordsGrid = document.getElementById('recordsGrid');
const lastUpdated = document.getElementById('lastUpdated');
const detailsSubtitle = document.getElementById('detailsSubtitle');
const detailsList = document.getElementById('detailsList');

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
        renderSelectedDetailTask(null, null);
        updateMasterToggleButton();
        return;
    }

    setMessage('', '');

    const tasksByProjectId = buildTasksByProjectMap(currentTasks);

    recordsGrid.innerHTML = records
        .map((project) => {
            const rawProjectId = Number(project.project_id);
            const projectId = escapeHtml(project.project_id);
            const projectName = escapeHtml(project.project_name || 'Untitled Project');
            const status = escapeHtml(project.status || 'Unknown');
            const startDate = escapeHtml(project.start_date || 'Not set');
            const dueDate = escapeHtml(project.due_date || 'Not set');
            const safeDescription = escapeHtml(project.description || '');
            const relatedTasks = tasksByProjectId.get(rawProjectId) || [];
            const detailsCount = relatedTasks.length;
            const isExpanded = expandedProjectIds.has(rawProjectId);
            const description = project.description && String(project.description).trim()
                ? `<p class="record-desc">${safeDescription}</p>`
                : '<p class="record-desc">No description</p>';

            const relatedTaskMarkup = detailsCount
                ? relatedTasks
                    .map((task) => {
                        const taskId = Number(task.task_id);
                        const isTaskSelected = selectedTaskId === taskId;
                        const taskTitle = escapeHtml(task.task_title || `Task ${taskId}`);
                        const taskPriority = escapeHtml(task.priority || 'Unknown');
                        const taskStatus = escapeHtml(task.status || 'Unknown');

                        return `
                            <button
                                class="detail-select-btn ${isTaskSelected ? 'active' : ''}"
                                type="button"
                                data-project-id="${projectId}"
                                data-task-id="${escapeHtml(task.task_id)}"
                            >
                                <span class="detail-select-title">${taskTitle}</span>
                                <span class="detail-select-meta">Priority: ${taskPriority} | Status: ${taskStatus}</span>
                            </button>
                        `;
                    })
                    .join('')
                : '<p class="small-note">No detail records under this master yet.</p>';

            return `
                <article class="record-card ${selectedProjectId === Number(project.project_id) ? 'selected' : ''}">
                    <button
                        class="record-title-toggle"
                        type="button"
                        data-project-id="${projectId}"
                        aria-expanded="${isExpanded ? 'true' : 'false'}"
                    >
                        <span>${projectName}</span>
                        <span class="small-note">${isExpanded ? 'Hide details' : 'Show details'}</span>
                    </button>
                    <p class="record-meta">Project ID: ${projectId}</p>
                    <p class="record-meta">Start: ${startDate} | Due: ${dueDate}</p>
                    <span class="status-chip">${status}</span>
                    ${description}

                    <div class="card-actions">
                        <button class="btn btn-primary select-project-btn" type="button" data-project-id="${projectId}" aria-expanded="${isExpanded ? 'true' : 'false'}">
                            ${isExpanded ? `Hide Details (${detailsCount})` : `Show Details (${detailsCount})`}
                        </button>
                        <button class="btn btn-secondary edit-toggle-btn" type="button" data-project-id="${projectId}">Edit Master</button>
                        <form class="inline-form delete-form" data-project-id="${projectId}">
                            <button class="btn btn-danger" type="submit">Delete Master</button>
                        </form>
                    </div>

                    <section class="project-details-block" ${isExpanded ? '' : 'hidden'}>
                        <p class="project-details-heading">Detail records under this master</p>
                        <div class="project-details-list">
                            ${relatedTaskMarkup}
                        </div>
                    </section>

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

    updateMasterToggleButton();
}

function areAllProjectsExpanded() {
    if (!Array.isArray(currentProjects) || currentProjects.length === 0) {
        return false;
    }

    return currentProjects.every((project) => expandedProjectIds.has(Number(project.project_id)));
}

function updateMasterToggleButton() {
    if (!toggleAllBtn) {
        return;
    }

    const totalProjects = Array.isArray(currentProjects) ? currentProjects.length : 0;
    const allExpanded = areAllProjectsExpanded();

    toggleAllBtn.disabled = totalProjects === 0;
    toggleAllBtn.textContent = allExpanded ? `Collapse All (${totalProjects})` : `Expand All (${totalProjects})`;
}

function toggleAllProjectDetails() {
    if (!Array.isArray(currentProjects) || currentProjects.length === 0) {
        return;
    }

    if (areAllProjectsExpanded()) {
        expandedProjectIds.clear();
        setStatus('Collapsed all master records.');
    } else {
        expandedProjectIds = new Set(currentProjects.map((project) => Number(project.project_id)));
        setStatus(`Expanded all master records (${currentProjects.length}).`);
    }

    renderRecords(currentProjects);
}

function buildTasksByProjectMap(tasks) {
    const taskMap = new Map();

    if (!Array.isArray(tasks)) {
        return taskMap;
    }

    for (const task of tasks) {
        const projectId = Number(task.project_id);

        if (!Number.isFinite(projectId)) {
            continue;
        }

        if (!taskMap.has(projectId)) {
            taskMap.set(projectId, []);
        }

        taskMap.get(projectId).push(task);
    }

    return taskMap;
}

function renderSelectedDetailTask(task, project) {
    if (!task || !project) {
        detailsSubtitle.textContent = 'Expand a master and click a detail to select it.';
        detailsList.innerHTML = '';
        return;
    }

    const projectName = escapeHtml(project.project_name || `Project ${project.project_id}`);
    const projectId = escapeHtml(project.project_id);
    const title = escapeHtml(task.task_title || 'Untitled Task');
    const taskId = escapeHtml(task.task_id);
    const priority = escapeHtml(task.priority || 'Unknown');
    const status = escapeHtml(task.status || 'Unknown');
    const dueDate = escapeHtml(task.due_date || 'Not set');
    const description = task.task_description && String(task.task_description).trim()
        ? `<p class="detail-desc">${escapeHtml(task.task_description)}</p>`
        : '<p class="detail-desc">No description</p>';

    detailsSubtitle.textContent = `Selected detail from ${projectName} (ID: ${projectId})`;

    detailsList.innerHTML = `
        <article class="detail-item">
            <h3>${title}</h3>
            <p class="detail-meta">Task ID: ${taskId}</p>
            <p class="detail-meta">Priority: ${priority} | Status: ${status} | Due: ${dueDate}</p>
            ${description}
        </article>
    `;
}

function findProjectById(projectId) {
    return currentProjects.find((project) => Number(project.project_id) === Number(projectId)) || null;
}

function findTaskById(taskId) {
    return currentTasks.find((task) => Number(task.task_id) === Number(taskId)) || null;
}

function toggleProjectDetails(projectId) {
    const numericProjectId = Number(projectId);

    if (!Number.isFinite(numericProjectId)) {
        return;
    }

    if (expandedProjectIds.has(numericProjectId)) {
        expandedProjectIds.delete(numericProjectId);
    } else {
        expandedProjectIds = new Set([numericProjectId]);
    }

    selectedProjectId = numericProjectId;
    renderRecords(currentProjects);
}

async function fetchMasterRecords() {
    if (!apiBaseUrl) {
        setMessage('error', 'No reachable backend was found. Start the Flask server and refresh.');
        setStatus('Backend unavailable.');
        return;
    }

    refreshBtn.disabled = true;
    setStatus('Loading master records...');
    setMessage('info', 'Loading master and detail records from the API...');

    try {
        const [projects, tasks] = await Promise.all([
            requestJson(`${apiBaseUrl}${MASTER_ENDPOINT}`),
            requestJson(`${apiBaseUrl}${DETAIL_ENDPOINT}`).catch(() => [])
        ]);

        currentProjects = Array.isArray(projects) ? projects : [];
        currentTasks = Array.isArray(tasks) ? tasks : [];

        expandedProjectIds = new Set(
            [...expandedProjectIds].filter((projectId) =>
                currentProjects.some((project) => Number(project.project_id) === projectId)
            )
        );

        if (selectedProjectId !== null) {
            const stillExists = currentProjects.some((project) => Number(project.project_id) === selectedProjectId);
            if (!stillExists) {
                selectedProjectId = null;
            }
        }

        if (selectedTaskId !== null) {
            const selectedTask = findTaskById(selectedTaskId);
            const selectedTaskProject = selectedTask ? findProjectById(selectedTask.project_id) : null;

            if (!selectedTask || !selectedTaskProject) {
                selectedTaskId = null;
                renderSelectedDetailTask(null, null);
            } else {
                renderSelectedDetailTask(selectedTask, selectedTaskProject);
            }
        } else {
            renderSelectedDetailTask(null, null);
        }

        renderRecords(currentProjects);

        const now = new Date();
        lastUpdated.textContent = now.toLocaleString();
        setStatus(`Loaded ${currentProjects.length} master records and ${currentTasks.length} detail records.`);
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
    const selectBtn = event.target.closest('.select-project-btn, .record-title-toggle');
    if (selectBtn) {
        const projectId = Number(selectBtn.dataset.projectId);
        toggleProjectDetails(projectId);
        setStatus(`Toggled detail list for project #${projectId}.`);
        return;
    }

    const detailSelectBtn = event.target.closest('.detail-select-btn');
    if (detailSelectBtn) {
        const projectId = Number(detailSelectBtn.dataset.projectId);
        const taskId = Number(detailSelectBtn.dataset.taskId);
        const selectedProject = findProjectById(projectId);
        const selectedTask = findTaskById(taskId);

        if (!selectedProject || !selectedTask) {
            return;
        }

        selectedProjectId = projectId;
        selectedTaskId = taskId;
        expandedProjectIds = new Set([projectId]);
        renderSelectedDetailTask(selectedTask, selectedProject);
        renderRecords(currentProjects);
        setStatus(`Selected detail #${taskId} for project #${projectId}.`);
        return;
    }

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

            if (selectedProjectId === Number(projectId)) {
                selectedProjectId = null;
                selectedTaskId = null;
                expandedProjectIds.delete(Number(projectId));
                renderSelectedDetailTask(null, null);
            }

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
    toggleAllBtn.addEventListener('click', toggleAllProjectDetails);
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
