# GrievanceResolve: Public Redressal System

GrievanceResolve is an enterprise-grade, full-stack web application designed to bridge the gap between citizens and public administration. It streamlines the process of reporting, tracking, and resolving public grievances through automation, role-based access control, and real-time audit trails.

**Repository:** https://github.com/Bhanuprasad0079/GMS

---

## Table of Contents
- Overview
- Key Features
- Technology Stack
- Prerequisites
- Installation and Setup
- Configuration
- Setting Up the First Administrator
- System Workflow
- Troubleshooting
- License

---

## Overview

This system provides a secure and transparent platform for citizens to lodge complaints regarding public services such as roads, sanitation, and utilities. The application automatically routes grievances to appropriate field workers based on category, tracks resolution progress with an immutable audit log, and provides administrators with a centralized operational overview.

---

## Key Features

### Role-Based Access Control (RBAC)
Distinct and secured dashboards for three user roles:

- **Citizens:** File complaints and track grievance status  
- **Field Workers:** View assigned tasks, update status, and log resolutions  
- **Administrators:** Oversee all tickets, manage staff accounts, and view analytics  

### Automated Workflow
Tickets are automatically routed to the correct department upon creation.  
For example, a *Pothole* complaint is instantly assigned to the *Roads & Transport* department.

### Real-Time Audit Trail
Every interaction with a ticket (status changes, priority updates, worker assignments) is logged with a timestamp and user identity in a permanent history timeline.

### Secure Authentication
Stateless authentication using JSON Web Tokens (JWT) stored in secure, HTTP-only cookies to mitigate XSS attacks.

### Email Notifications
Automated SMTP alerts notify users when tickets are created, assigned, or resolved.

### Responsive Interface
A fully responsive user interface built with Next.js and Tailwind CSS, including seamless dark mode support.

---

## Technology Stack

### Frontend
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- State Management: React Hooks

### Backend
- Framework: ASP.NET Core 8.0 Web API
- Language: C#
- Database: SQL Server (via Entity Framework Core)
- Security: BCrypt Hashing, JWT Authentication, CORS Policies
- Documentation: Swagger UI

---

## Prerequisites

Ensure the following are installed before starting:

- Node.js (v18 or higher)
- .NET SDK (8.0 or higher)
- SQL Server (Express or Developer Edition)
- SQL Server Management Studio (SSMS) or Azure Data Studio (optional)

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Bhanuprasad0079/GMS.git
cd GMS 
```
### 2. Backend Setup (ASP.NET Core)


Navigate to the backend directory:
```bash
cd server
```

**Initialize the Database**

Run Entity Framework migrations to create the database schema:
```bash
dotnet ef database update
```
**Run the Backend Server**
```bash 
dotnet watch run
```
**The backend server will typically run at:**
```arduino
http://localhost:5087
```

### 3. Frontend Setup (Next.js)
Open a new terminal and navigate to the frontend directory:
```bash
cd client
```
**Install Dependencies**
```bash
npm install
```
**Run the application**
```bash
npm run dev
```
The application will be accessible at:
```arduino
http://localhost:3000
```

---
## Configuration
You must configure the backend to connect to your database and email service.

Open server/appsettings.json and update the following values:
```json

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=GrievanceDB;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "EmailSettings": {
    "Email": "your Email ID", 
    "Password": "Email ID app Password"
  },
  "Jwt": {
    "Key": "4pXJLekqJbDqK9IXplRMo57yE+3J4aUQgB/nHQBVJxQ=",
    "Issuer": "http://localhost:5000",
    "Audience": "http://localhost:3000"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```
## Important Email Note

Do not use your personal Gmail password.
Generate an App Password from Google Account → Security → 2-Step Verification → App Passwords.

---

## Setting Up the First Administrator

Public users cannot create Admin accounts. The first SuperAdmin must be bootstrapped via the backend API.
### 1. Ensure the backend is running:
```arduino
http://localhost:5087
```
### 2. Open Swagger UI:
```bash
http://localhost:5087/swagger
```
## Temporarily Disable Authorization

### 1. Open backend1/Controllers/AuthController.cs
### 2. Locate the CreateStaff method
### 3. Comment out:
```csharp
[Authorize(Roles = "Admin,SuperAdmin")]
```
### 4.Save the file

---

## Create SuperAdmin via Swagger

Use POST /api/Auth/create-staff and submit:
```json
{
  "fullName": "System SuperAdmin",
  "email": "admin@gms.gov",
  "password": "SecurePassword123!",
  "role": "SuperAdmin",
  "department": "Headquarters",
  "gender": "Male",
  "address": "Server Room",
  "state": "Delhi",
  "district": "New Delhi",
  "pincode": "110001"
}
```
## After successful creation:

- Re-enable the authorization attribute

- Save the file
Admin login **URL**:
```bash
http://localhost:3000/login/adminloginpage
```

---

## System Workflow
### 1. Citizen Registration and Reporting
- Citizens sign up at /signup
- File grievances by selecting a category
- Receive confirmation emails with Ticket ID 
### 2. Automated Assignment
- Backend creates the ticket
- Assigns it to a matching field worker if available
- Otherwise, the ticket remains OPEN for admin assignment
### 3. Field Worker Actions
- Login at /login/workerloginpage
- View assigned tickets
- Update status to IN_REVIEW and RESOLVED
- All actions are logged in the audit trail
### 4. Administrative Oversight
- Login at /login/adminloginpage
- Full visibility of users and tickets
- Manage staff, reset passwords, reassign tickets
- Review audit logs for accountability

---

## Troubleshooting
### CORS Errors
Ensure the backend allows requests from the frontend origin:
```csharp
builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()));
```
### Database Schema Errors

If schema mismatches occur:
```bash
dotnet ef migrations add SyncSchema
dotnet ef database update
```

### Email Delivery Issues
- Ensure App Passwords are used
- Verify SMTP credentials
- Check backend logs for SMTP errors

---

Designed and Developed by Bhanu Prasad Khuntia
Bhanuprasad0079
