# Employee Management System

## Overview
A full-stack Employee Management System built with Django, Django REST Framework, and Next.js (App Router). Features include JWT authentication, Role-Based Access Control (Admin vs Employee), a dynamic form builder, and dynamic employee data management using PostgreSQL JSONField concepts.

## Tech Stack
- **Backend:** Python, Django, DRF, SimpleJWT, SQLite (default, can use Postgres)
- **Frontend:** Next.js (TypeScript, App Router), Tailwind CSS, dnd-kit (drag-and-drop), Axios

## Project Structure
- `backend/`: Django API server
- `frontend/`: Next.js client application
- `postman_collection.json`: API testing collection

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
# OR source venv/bin/activate # On Mac/Linux
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
The backend API will run at `http://localhost:8000`.

### 2. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will run at `http://localhost:3000`.

### 3. Environment Variables
Check the `.env.example` files in both directories for required environment variables.

### 4. Admin vs Employee
- Admin users can create Dynamic Forms, add Form Fields, and create/manage Employees.
- Employee users can only view Forms and Employees.
- During registration, you can choose the role, or assign it via Django Admin.

## Features implemented
- [x] Authentication & Profile
- [x] Dynamic Form Builder (Drag & Drop Reordering)
- [x] Employee CRUD using dynamic forms via JSONField
- [x] Role-based access control
- [x] REST API implementation
- [x] Postman collection export
- [x] Clean architecture and UI

## Authors
- Generated via Gemini CLI
