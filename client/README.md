# Taskora 🚀

Taskora is a modern, full-stack project management application built with the MERN stack (MongoDB, Express.js, React, Node.js). It helps you organize your tasks efficiently with features like priority filtering, dark mode, and a responsive user interface.

## ✨ Features

- **Authentication**: Secure Login and Registration using JWT.
- **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
- **Filtering**: Filter tasks by status (Pending/Completed) and Priority (High/Medium/Low).
- **Dashboard**: Overview of task statistics and recent activity.
- **Theming**: Built-in Dark Mode and Light Mode toggle.
- **Responsive Design**: Optimized for desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Custom CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud Atlas URI)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

If you haven't already, navigate to the project folder:
```bash
cd Taskora
```

### 2. Backend Setup (Server)

Navigate to the server folder and install dependencies:

```bash
cd Taskora-Server/server
npm install
```

Start the backend server:

```bash
npm run dev
```
*The server will run on `http://localhost:5005`*

### 3. Frontend Setup (Client)

Open a new terminal, navigate to the client folder, and install dependencies:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```
*The client will run on `http://localhost:5173` (or similar port shown in terminal)*

## 📂 Project Structure

```
Taskora/
├── client/          # Frontend React Application
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, Sidebar, Modals)
│   │   ├── contexts/    # React Contexts (Auth, Theme)
│   │   ├── pages/       # Application Pages (Dashboard, Tasks, Login)
│   │   └── App.css      # Global Styles & Theming
│   └── package.json
│
└── Taskora-Server/  # Backend Node.js Application
    └── server/
        ├── models/      # Mongoose Database Models
        ├── routes/      # API Routes (Auth, Tasks)
        ├── middleware/  # Auth Middleware
        └── server.js    # Entry Point
```

## 📝 Usage

1.  **Register** a new account.
2.  **Login** to access your dashboard.
3.  Use the **"Add New Task"** button to create tasks.
4.  Use the **Sidebar** to navigate between Dashboard, All Tasks, Pending, and Completed.
5.  Use the **Priority Buttons** (High, Medium, Low) to filter your view.
6.  Toggle the **Sun/Moon icon** in the navbar to switch themes.

---
*Created for IronHack Project*
Frontend application for Taskora.
