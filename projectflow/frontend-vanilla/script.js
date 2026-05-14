// ===========================
// Configuration
// ===========================
const API_BASE_URL = 'http://localhost:5000';
let selectedProjectId = null;

// ===========================
// DOM Elements
// ===========================
const projectForm = document.getElementById('projectForm');
const taskForm = document.getElementById('taskForm');
const projectsList = document.getElementById('projectsList');
const tasksList = document.getElementById('tasksList');
const newProjectBtn = document.getElementById('newProjectBtn');
const newTaskBtn = document.getElementById('newTaskBtn');
const cancelProjectBtn = document.getElementById('cancelProjectBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const statusMessage = document.getElementById('statusMessage');
const apiEndpoint = document.getElementById('apiEndpoint');
const toast = document.getElementById('toast');

// ===========================
// API Helper Functions
// ===========================

/**
 * Make API requests with error handling
 */

const loadChartsBtn = document.getElementById("load-charts-btn");

let taskStatusChart = null;
let taskPriorityChart = null;
let supportNeedsChart = null;
let riskLevelChart = null;

loadChartsBtn.addEventListener("click", loadDashboardCharts);

async function apiCall(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

/**
 * Display toast notification
 */
function showToast(message, type = 'success', duration = 3000) {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Update status message
 */
function updateStatus(message) {
    statusMessage.textContent = message;
}

// ===========================
// Projects Functions
// ===========================

/**
 * Fetch all projects from API
 */
async function fetchProjects() {
    try {
        updateStatus('Loading projects...');
        const data = await apiCall('/api/projects');
        renderProjects(data);
        updateStatus('Projects loaded successfully');
    } catch (error) {
        projectsList.innerHTML = '<div class="empty-state">Failed to load projects</div>';
        updateStatus('Error loading projects');
    }
}

/**
 * Render projects to the DOM
 */
function renderProjects(projects) {
    if (!projects || projects.length === 0) {
        projectsList.innerHTML = '<div class="empty-state">No projects yet. Create one to get started!</div>';
        return;
    }

    projectsList.innerHTML = projects.map(project => `
        <div class="project-card ${selectedProjectId === project.project_id ? 'selected' : ''}" 
             onclick="selectProject(${project.project_id})">
            <div class="project-card-header">
                <h3>${escapeHtml(project.project_name)}</h3>
                <span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">
                    ${project.status}
                </span>
            </div>
            ${project.description ? `<p class="project-card-description">${escapeHtml(project.description)}</p>` : ''}
            <div class="project-card-actions">
                <button class="btn btn-edit" onclick="editProject(${project.project_id}, event)">Edit</button>
                <button class="btn btn-danger" onclick="deleteProject(${project.project_id}, event)">Delete</button>
            </div>
        </div>
    `).join('');
}

/**
 * Select a project and load its tasks
 */
async function selectProject(projectId) {
    selectedProjectId = projectId;
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    newTaskBtn.disabled = false;
    
    await fetchTasks(projectId);
}

/**
 * Create new project
 */
async function createProject(e) {
    e.preventDefault();

    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;
    const projectStatus = document.getElementById('projectStatus').value;

    if (!projectName || !projectStatus) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }

    try {
        updateStatus('Creating project...');
        await apiCall('/api/projects', {
            method: 'POST',
            body: JSON.stringify({
                project_name: projectName,
                description: projectDesc,
                status: projectStatus
            })
        });

        showToast('Project created successfully!', 'success');
        projectForm.classList.add('hidden');
        projectForm.reset();
        await fetchProjects();
        updateStatus('Project created successfully');
    } catch (error) {
        updateStatus('Error creating project');
    }
}

/**
 * Delete project
 */
async function deleteProject(projectId, event) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
    }

    try {
        updateStatus('Deleting project...');
        await apiCall(`/api/projects/${projectId}`, {
            method: 'DELETE'
        });

        showToast('Project deleted successfully!', 'success');
        if (selectedProjectId === projectId) {
            selectedProjectId = null;
            tasksList.innerHTML = '<p class="empty-state">Select a project to view tasks</p>';
            newTaskBtn.disabled = true;
        }
        await fetchProjects();
        updateStatus('Project deleted successfully');
    } catch (error) {
        updateStatus('Error deleting project');
    }
}

/**
 * Edit project (placeholder - could be expanded)
 */
function editProject(projectId, event) {
    event.stopPropagation();
    showToast('Edit functionality coming soon!', 'warning');
}

// ===========================
// Tasks Functions
// ===========================

/**
 * Fetch tasks for a project
 */
async function fetchTasks(projectId) {
    try {
        updateStatus('Loading tasks...');
        const data = await apiCall(`/api/projects/${projectId}/tasks`);
        renderTasks(data.tasks || []);
        updateStatus('Tasks loaded successfully');
    } catch (error) {
        tasksList.innerHTML = '<div class="empty-state">Failed to load tasks</div>';
        updateStatus('Error loading tasks');
    }
}

/**
 * Render tasks to the DOM
 */
function renderTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<p class="empty-state">No tasks for this project yet. Create one to get started!</p>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.task_title)}</div>
                ${task.task_description ? `<div class="task-description">${escapeHtml(task.task_description)}</div>` : ''}
                <div class="task-metadata">
                    <span class="task-badge task-priority-${task.priority.toLowerCase()}">
                        Priority: ${task.priority}
                    </span>
                    <span class="task-badge task-status-${task.status.toLowerCase().replace(' ', '-')}">
                        ${task.status}
                    </span>
                    ${task.due_date ? `<span class="task-badge">Due: ${task.due_date}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-edit" onclick="editTask(${task.task_id}, event)">Edit</button>
                <button class="btn btn-danger" onclick="deleteTask(${task.task_id}, event)">Delete</button>
            </div>
        </div>
    `).join('');
}

/**
 * Create new task
 */
async function createTask(e) {
    e.preventDefault();

    if (!selectedProjectId) {
        showToast('Please select a project first', 'warning');
        return;
    }

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDesc = document.getElementById('taskDesc').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskStatus = document.getElementById('taskStatus').value;
    const taskDueDate = document.getElementById('taskDueDate').value;

    if (!taskTitle || !taskPriority || !taskStatus) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }

    try {
        updateStatus('Creating task...');
        await apiCall(`/api/projects/${selectedProjectId}/tasks`, {
            method: 'POST',
            body: JSON.stringify({
                task_title: taskTitle,
                task_description: taskDesc,
                priority: taskPriority,
                status: taskStatus,
                due_date: taskDueDate || null
            })
        });

        showToast('Task created successfully!', 'success');
        taskForm.classList.add('hidden');
        taskForm.reset();
        await fetchTasks(selectedProjectId);
        updateStatus('Task created successfully');
    } catch (error) {
        updateStatus('Error creating task');
    }
}

/**
 * Delete task
 */
async function deleteTask(taskId, event) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        updateStatus('Deleting task...');
        await apiCall(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        showToast('Task deleted successfully!', 'success');
        if (selectedProjectId) {
            await fetchTasks(selectedProjectId);
        }
        updateStatus('Task deleted successfully');
    } catch (error) {
        updateStatus('Error deleting task');
    }
}

/**
 * Edit task (placeholder - could be expanded)
 */
function editTask(taskId, event) {
    event.stopPropagation();
    showToast('Edit functionality coming soon!', 'warning');
}

// ===========================
// Utility Functions
// ===========================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Check backend connectivity
 */
async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        if (response.ok) {
            showToast('Backend connected successfully!', 'success');
            updateStatus('Connected to backend');
            return true;
        }
    } catch (error) {
        showToast(`Cannot connect to backend at ${API_BASE_URL}. Make sure the Flask server is running.`, 'error', 5000);
        updateStatus(`Cannot connect to backend at ${API_BASE_URL}`);
        return false;
    }
}

// ===========================
// Event Listeners
// ===========================

// Project Form Events
newProjectBtn.addEventListener('click', () => {
    projectForm.classList.toggle('hidden');
    if (!projectForm.classList.contains('hidden')) {
        document.getElementById('projectName').focus();
    }
});

cancelProjectBtn.addEventListener('click', () => {
    projectForm.classList.add('hidden');
    projectForm.reset();
});

projectForm.addEventListener('submit', createProject);

// Task Form Events
newTaskBtn.addEventListener('click', () => {
    if (!selectedProjectId) {
        showToast('Please select a project first', 'warning');
        return;
    }
    taskForm.classList.toggle('hidden');
    if (!taskForm.classList.contains('hidden')) {
        document.getElementById('taskTitle').focus();
    }
});

cancelTaskBtn.addEventListener('click', () => {
    taskForm.classList.add('hidden');
    taskForm.reset();
});

taskForm.addEventListener('submit', createTask);

// ===========================
// Initialize App
// ===========================
async function initializeApp() {
    console.log('Initializing ProjectFlow Frontend...');
    
    // Update API endpoint display
    apiEndpoint.textContent = API_BASE_URL;
    
    // Check backend connection
    const connected = await checkBackendConnection();
    
    if (connected) {
        // Load projects
        await fetchProjects();
    } else {
        projectsList.innerHTML = `
            <div class="empty-state">
                <p>⚠️ Cannot connect to backend</p>
                <p>Make sure the Flask server is running at ${API_BASE_URL}</p>
                <p>Run: <code>python3 app.py</code> in the backend directory</p>
            </div>
        `;
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

async function loadDashboardCharts() {
    try {
        const chartData = await apiCall('/api/dashboard/charts');

        createTaskStatusChart(chartData.task_status || {});
        createTaskPriorityChart(chartData.task_priority || {});
        createSupportNeedsChart(chartData.support_needs || {});
        createRiskLevelChart(chartData.risk_levels || {});

    } catch (error) {
        alert(`Chart loading failed: ${error.message}`);
    }
}

function createTaskStatusChart(statusCounts) {
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    const ctx = document.getElementById("task-status-chart");

    if (taskStatusChart) {
        taskStatusChart.destroy();
    }

    taskStatusChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Number of Tasks",
                    data: data
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Tasks by Status"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function createTaskPriorityChart(priorityCounts) {
    const labels = Object.keys(priorityCounts);
    const data = Object.values(priorityCounts);

    const ctx = document.getElementById("task-priority-chart");

    if (taskPriorityChart) {
        taskPriorityChart.destroy();
    }

    taskPriorityChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Task Priority",
                    data: data
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Tasks by Priority"
                }
            }
        }
    });
}

function createSupportNeedsChart(supportNeedsCounts) {
    const labels = Object.keys(supportNeedsCounts);
    const data = Object.values(supportNeedsCounts);

    const ctx = document.getElementById("support-needs-chart");

    if (supportNeedsChart) {
        supportNeedsChart.destroy();
    }

    supportNeedsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Youth Count",
                    data: data
                }
            ]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Sample Youth Support Needs"
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function createRiskLevelChart(riskLevelCounts) {
    const labels = Object.keys(riskLevelCounts);
    const data = Object.values(riskLevelCounts);
    const backgroundColor = labels.map((label) => {
        const normalized = String(label).toLowerCase();

        if (normalized === "high") {
            return "#ef4444";
        }
        if (normalized === "medium") {
            return "#f59e0b";
        }
        if (normalized === "low") {
            return "#10b981";
        }
        return "#3b82f6";
    });

    const ctx = document.getElementById("risk-level-chart");

    if (riskLevelChart) {
        riskLevelChart.destroy();
    }

    riskLevelChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Youth Risk Levels",
                    data: data,
                    backgroundColor: backgroundColor
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Youth Risk Levels"
                }
            }
        }
    });
}