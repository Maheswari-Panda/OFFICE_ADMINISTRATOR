# 🗂️ OFFICE_ADMINISTRATOR – Inward and Outward Document Management System

A web-based document management system built with **React**, **Node.js**, and **MS SQL Server** to handle and track **inward and outward correspondence** in an office or organization. The system helps maintain a secure and searchable digital log of all documents flowing in and out of the organization.

> 📍 Repository: [Maheswari-Panda/OFFICE_ADMINISTRATOR](https://github.com/Maheswari-Panda/OFFICE_ADMINISTRATOR)

---

## 🚀 Features

- 📥 Add, view, and manage **Inward Documents**
- 📤 Add, view, and manage **Outward Documents**
- 🔍 Search and filter documents by date, sender/receiver, subject, or reference number
- 🧾 Organized listing of correspondence for easy tracking
- 👤 Role-based access (Admin, Clerk, Viewer – optional for future enhancement)
- 📊 Clean and user-friendly interface built with React

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React, Tailwind CSS, DaisyUI   |
| Backend      | Node.js, Express.js            |
| Database     | Microsoft SQL Server (MSSQL)   |
| Tools Used   | VS Code, Git, GitHub, Postman  |

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository:
git clone https://github.com/Maheswari-Panda/OFFICE_ADMINISTRATOR.git
cd OFFICE_ADMINISTRATOR

### 2️⃣ Backend Setup (Node + Express)
Navigate to the backend folder:
    cd backend
    npm install
    Set up .env with your MSSQL config:

inside .env
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_SERVER=localhost
    DB_DATABASE=office_docs

Start the backend server:
    npm start

### 3️⃣ Frontend Setup (React)
Navigate to the frontend folder:
    cd ../frontend
    npm install
    npm start or npm run dev
Visit: http://localhost:1573

🧩 Database Schema (MSSQL)
You should create two tables:
![image](https://github.com/user-attachments/assets/d0765307-11d3-4372-b952-4af4685e0023)

(You can include a sample SQL schema in your repo for easy setup.)

🖼️ Screenshots
![image](https://github.com/user-attachments/assets/460451ec-cb33-4b61-a7a9-d9b0aba5ff3a)
![image](https://github.com/user-attachments/assets/fe6ae934-124c-4fe4-8fe8-27e4acea974d)
![image](https://github.com/user-attachments/assets/c905ba9b-d3e3-40fd-9bd1-18f67215c2cb)
![image](https://github.com/user-attachments/assets/402a6b97-875d-4101-a299-eee82fc3d9f3)
![image](https://github.com/user-attachments/assets/5ba2f282-d955-4d60-958f-0b514d9d38a3)


📁 Folder Structure
  OFFICE_ADMINISTRATOR/
  ├── frontend/         # React code
  ├── backend/          # Node.js + Express API
  ├── database/         # SQL schema or migration files
  ├── .env              # DB credentials (excluded from Git)
  └── README.md


