# TaskMatrix – Smart Project Management Tool

Product Requirements Document (PRD)

## Project Overview

**TaskMatrix** is a modern, web-based project management application designed for software teams to efficiently manage tasks, track progress, and collaborate in real-time. It combines the simplicity of Trello with the power of Jira, providing a Kanban board interface for agile task management.

The platform enables teams to:

- Organize work into projects
- Create and manage tasks with priorities and deadlines
- Visualize workflow using Kanban boards (To Do → In Progress → Done)
- Track team activity and stay updated on project changes

## Track - Frontend Track

## Tech Stack

### Frontend Framework & UI

- **Next.js 15** (React 19 with App Router for SSR/SSG)
- **Tailwind CSS** (Utility-first styling)
- **ShadCN/ui** (Pre-built accessible component library)
- **TypeScript** (Type safety and better DX)

### State Management

- **Zustand** (Lightweight, simple state store for tasks, projects, user data)

### Form & Validation

- **React Hook Form** (Efficient form handling)
- **Zod** (Runtime schema validation)

### Data Visualization & Interactions

- **React Beautiful DND** or **Framer Motion** (Drag-and-drop for Kanban)
- **React Query** (Server-state management for API calls)
- **Axios** (HTTP client)

### UI/UX Enhancements

- **Lucide Icons** (Icon library)
- **React Toastify** (Notifications)
- **Date-fns** (Date manipulation)

### Development & Tooling

- **ESLint & Prettier** (Code quality)
- **Jest & React Testing Library** (Unit tests)
- **Storybook** (Component documentation)

### Deployment

- **Vercel** (Optimized for Next.js)

## Core Features

### 1. ** Authentication & User Management**

- User signup/login form with email validation
- JWT token storage (localStorage)
- Protected routes and role-based access
- User profile management
- Logout functionality

### 2. ** User Dashboard**

- Quick overview of user's projects
- List of assigned tasks (to-do count)
- Recent activity feed
- Quick action buttons (Create Project, Create Task)

### 3. ** Project Management**

- **Create Projects** - Form to create new project with title, description, color tag
- **View Projects** - List all projects with team member count and task statistics
- **View Project Details** - See project overview with all tasks, team members, timeline
- **Edit Project** - Update project name, description, team members
- **Delete Project** - Remove project with confirmation

### 4. ** Task Management**

- **Create Tasks** - Form with title, description, priority, due date, assigned user
- **View Tasks** - List or grid view with filters (priority, assignee, due date)
- **View Task Details** - Modal/page with full task information, comments, activity log
- **Edit Tasks** - Update any task property
- **Delete Tasks** - Remove tasks with confirmation
- **Task Properties:**
  - Title & Description
  - Priority (Low, Medium, High, Critical)
  - Status (To Do, In Progress, Done)
  - Due Date
  - Assigned User/Team
  - Tags/Labels
  - Subtasks (optional)

### 5. ** Kanban Board**

- **Drag & Drop Interface** - Move tasks between columns
- **Three Status Columns:** To Do | In Progress | Done
- **Task Cards** - Show task title, assignee avatar, priority indicator, due date
- **Filter & Search** - Filter by assignee, priority, or search by task name
- **Bulk Actions** - Select multiple tasks and change status

## UI Wireframes (Figma)

1. **Login Page** - Email/password input, sign-up link, forgot password link
2. **Dashboard** - Project overview, task quick-access, activity feed
3. **Kanban Board** - Three columns, task cards, filters, drag-and-drop

**🔗 Figma Link:** (https://www.figma.com/design/0IoBrLWDvRm6kHtcHWAVLs/TaskMatrix?node-id=0-1&t=b1ikjzXhjezpB67a-1)

## State Management Structure (Zustand)

### Store Organization

```
store/
├── useAuthStore.ts          # Auth state (user, token, login/logout)
├── useProjectStore.ts       # Projects data and filters
├── useTaskStore.ts          # Tasks, filters, selected task
├── useUIStore.ts            # Theme, sidebar toggle, modals
└── useNotificationStore.ts  # Toast notifications
```

### State Tree Diagram

```
AuthStore
├── currentUser: User
├── isAuthenticated: boolean
├── token: string
└── actions: login(), logout(), signup()

ProjectStore
├── projects: Project[]
├── selectedProject: Project | null
├── loading: boolean
├── filter: { search, teamMember }
└── actions: fetchProjects(), createProject(), updateProject(), deleteProject()

TaskStore
├── tasks: Task[]
├── selectedTask: Task | null
├── taskFilter: { priority, status, assignee, projectId }
├── loading: boolean
└── actions: fetchTasks(), createTask(), updateTask(), deleteTask(), moveTask()

UIStore
├── theme: 'light' | 'dark'
├── sidebarOpen: boolean
├── activeModal: string | null
└── actions: toggleTheme(), toggleSidebar(), openModal(), closeModal()

NotificationStore
├── notifications: Notification[]
└── actions: addNotification(), removeNotification(), clearAll()
```

## Data Models (Mock Interfaces)

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "member";
}
```

### Project

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  owner: User;
  teamMembers: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}
```

### Activity

```typescript
interface Activity {
  id: string;
  type: "created" | "updated" | "moved" | "commented";
  entity: "task" | "project";
  entityId: string;
  user: User;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  timestamp: Date;
}
```

## Project Folder Structure

```
taskmatrix/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard)
│   ├── login/
│   ├── projects/
│   │   ├── page.tsx (Projects List)
│   │   └── [id]/
│   │       └── page.tsx (Project Details)
│   ├── kanban/
│   │   └── [projectId]/page.tsx
│   └── tasks/
│       └── [id]/page.tsx
├── components/
│   ├── auth/ (Login, Signup forms)
│   ├── layout/ (Header, Sidebar, Footer)
│   ├── project/ (ProjectCard, ProjectForm)
│   ├── task/ (TaskCard, TaskForm, TaskModal)
│   ├── kanban/ (KanbanBoard, Column, TaskList)
│   └── common/ (Button, Input, Modal)
├── store/
│   ├── authStore.ts
│   ├── projectStore.ts
│   ├── taskStore.ts
│   ├── uiStore.ts
│   └── notificationStore.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useTasks.ts
├── services/
│   ├── api.ts (Axios config with mock interceptors)
│   ├── auth.ts
│   ├── projects.ts
│   └── tasks.ts
├── lib/
│   ├── mockData.ts (Mock data generators)
│   └── utils.ts
├── styles/
│   └── globals.css
└── public/
```

## Database Schema (High Level)

### Users

- \_id
- name
- email
- password
- role

### Projects

- \_id
- name
- description
- createdBy
- members[]

### Tasks

- \_id
- title
- description
- status (To Do / In Progress / Done)
- priority
- assignedTo
- projectId
- dueDate

### Comments

- \_id
- taskId
- userId
- message

### Activity Logs

- \_id
- userId
- action
- timestamp

## API Endpoints (Sample)

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Projects

- GET /api/projects
- POST /api/projects
- DELETE /api/projects/:id

### Tasks

- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
