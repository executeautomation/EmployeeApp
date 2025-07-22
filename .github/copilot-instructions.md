# Product Specification: Employee Manager Application

## Overview
A full-stack Employee Manager application with a React (Material UI) frontend and a Node.js/Express/SQLite backend. The app allows users to log in, manage employees (add, edit, delete, view), search/filter, and supports responsive design and dark mode.

---

## Backend API Specification

### Base URL
`http://localhost:4000`

### Endpoints

#### Authentication
- `POST /login`
  - **Description:** Dummy login, accepts any username/password.
  - **Request Body:** `{ username: string, password: string }`
  - **Response:** `{ success: true }`

#### Employees
- `GET /employees`
  - **Description:** Get all employees.
  - **Response:** `[{ id, name, email, position }]`

- `POST /employees`
  - **Description:** Add a new employee.
  - **Request Body:** `{ name: string, email: string, position: string }`
  - **Response:** `{ id, name, email, position }`

- `PUT /employees/:id`
  - **Description:** Update an employee.
  - **Request Body:** `{ name: string, email: string, position: string }`
  - **Response:** `{ id, name, email, position }`

- `DELETE /employees/:id`
  - **Description:** Delete an employee.
  - **Response:** `{ success: true }`

### Data Model
- **Employee:**
  - `id`: integer (auto-increment)
  - `name`: string
  - `email`: string
  - `position`: string

---

## Frontend Specification

### Main Features
- **Login Page:** Dummy login, stores session in localStorage.
- **Employee List:**
  - View all employees in a responsive, searchable, filterable table.
  - Edit, view, and delete employees with dialogs.
  - Add employee via modal or dedicated page.
- **Employee Form:** Add or edit employee details.
- **Search & Filter:** Real-time search by name, email, or position.
- **Responsive Design:** Works on desktop, tablet, and mobile.
- **Dark Mode:** Toggle between light and dark themes.
- **Navigation:** Menu bar with navigation and theme toggle.

### Tech Stack
- **Frontend:** React, Material UI, Axios, React Router
- **Backend:** Node.js, Express, SQLite

---

## Future Enhancements (Optional)
- User authentication with roles
- Profile pictures
- Import/export employees
- Audit log
- Department/team management
- Dashboard/analytics 