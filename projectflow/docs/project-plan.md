# ProjectFlow Project Plan

## App Idea

ProjectFlow is a ListDetails web application that helps users manage projects and the tasks connected to each project. A user can create projects, view all projects, update project information, delete projects, and manage tasks that belong to each project.

The purpose of this app is to demonstrate a 3-tier web application using a frontend, a REST API backend, and a relational database. The app will show how data moves from the database, through the API, and into the user interface.

## Master-Detail Relationship

This app uses the following master-detail relationship:

Project → Tasks

The master table is `projects`.

The detail table is `tasks`.

One project can have many tasks, but each task belongs to only one project.

Example:

Project: Build Portfolio Website

Tasks:
- Design homepage
- Add project section
- Add contact form
- Deploy website

This follows a one-to-many relationship because one project can contain multiple related tasks.

## Tech Stack

### Backend

Python with Flask will be used to create the REST API.

### Database

SQLite will be used as the relational database.

### Frontend

The project will include two frontend versions:

1. Vanilla JavaScript frontend
2. React frontend

### API Testing

curl will be used first to test the API from the terminal.

A GUI REST client such as Postman or Insomnia may be used later to test the endpoints more clearly.

## Database Plan

The database will contain two main tables:

### projects table

Fields:

- project_id
- project_name
- description
- status
- start_date
- due_date

### tasks table

Fields:

- task_id
- project_id
- task_title
- task_description
- priority
- status
- due_date

The `project_id` field in the `tasks` table will be a foreign key that connects each task to one project.

## API Plan

The REST API will allow users to create, read, update, and delete both projects and tasks.

### Project Endpoints

GET /api/projects  
GET /api/projects/{id}  
POST /api/projects  
PUT /api/projects/{id}  
DELETE /api/projects/{id}  

### Task Endpoints

GET /api/tasks  
GET /api/tasks/{id}  
POST /api/tasks  
PUT /api/tasks/{id}  
DELETE /api/tasks/{id}  

### Master-Detail Endpoint

GET /api/projects/{id}/tasks  

This endpoint will return one project and all of the tasks connected to that project.

## Frontend Plan

The frontend will allow users to interact with the REST API through a web page.

The Vanilla JavaScript version will include:

- A page to view all projects
- A page to view all tasks
- Forms to create projects
- Forms to create tasks
- Buttons to update and delete records
- A master-detail view showing a selected project and its related tasks

The React version will include similar features using React components.

Possible React components:

- ProjectList
- ProjectCard
- ProjectForm
- TaskList
- TaskCard
- TaskForm
- ProjectDetails

## Basic Timeline

### Day 1

- Choose the master-detail relationship
- Create the project plan
- Create the project folder structure
- Design the database tables

### Day 2

- Write the SQL schema file
- Write the SQL seed data file
- Create the SQLite database
- Test the database with SELECT queries

### Day 3

- Create the Flask backend
- Connect Flask to SQLite
- Build GET endpoints for projects and tasks
- Test endpoints with curl

### Day 4

- Add full CRUD operations for projects
- Add full CRUD operations for tasks
- Add the one-to-many endpoint for project tasks
- Test API routes with curl or Postman

### Day 5

- Build the Vanilla JavaScript frontend
- Display projects from the API
- Display tasks from the API
- Create basic forms for adding data

### Day 6

- Build the React frontend
- Create project and task components
- Connect React to the Flask API
- Build the master-detail dashboard view

### Day 7

- Test the full app
- Fix bugs
- Update README
- Add screenshots if needed
- Prepare final submission

## Success Criteria

This project will be complete when:

- The database has projects and tasks tables
- The tasks table connects to the projects table using a foreign key
- The Flask REST API can perform CRUD operations
- The API can return all tasks for a selected project
- The Vanilla JavaScript frontend can display and manage data
- The React frontend can display and manage data
- The README explains how to run the project