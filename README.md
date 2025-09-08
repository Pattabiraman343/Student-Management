
📚 Student Management System

A full-stack Student Management System built with React, Node.js, and PostgreSQL.
✅ Features user authentication, role-based access, CRUD operations for students, Excel import/export, dashboard analytics, and audit logs.
🔗 Live Demo: https://student-management-nine-rho.vercel.app/

Admin credentials

Username  :  Admin
Password  :  admin@123


Teacher credentials

Username  :  Geetha
Password  :  geetha@123


🚀 Features
Core

User Registration & Login (JWT Auth)

Add / Edit / Delete / View students

Upload student profile photos

Search & filter by name, grade, section

Pagination for student list

Smart

Role-Based Access: Admin (full access), Teacher (view only)

Excel Import & Export with validation

Dashboard: total students, students per class, gender ratio (charts)

Audit logs for all actions

🛠️ Tech Stack

Frontend: React, Redux, React Query, TailwindCSS / CSS
Backend: Node.js, Express, Sequelize ORM, PostgreSQL
Authentication: JWT
Charts: Recharts
Excel: XLSX

📂 Project Structure
student-management-system/
│── server/         # Backend
│   ├── config/     # DB config
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js    # Entry point
│
│── client/         # Frontend
│   ├── src/
│   └── package.json
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the repo
git clone https://github.com/your-username/student-management-system.git
cd student-management-system

2️⃣ Backend Setup
cd server
npm install


Update PostgreSQL credentials in server/config/db.js or .env:

DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432


Start the backend:

node index.js


Backend runs at: http://localhost:5000

3️⃣ Frontend Setup
cd ../client
npm install
npm start


Frontend runs at: http://localhost:3000

📝 Notes

Admin role can manage students; Teacher role can only view.


Admin credentials

Username  :  Admin
Password  :  admin@123


Teacher credentials

Username  :  Geetha
Password  :  geetha@123


Excel import/export available on the Students page.

Audit logs track all add/edit/delete actions.

✅ Ready to Use:

Start PostgreSQL

Run backend → node index.js

Run frontend → npm start

Open browser → http://localhost:3000
