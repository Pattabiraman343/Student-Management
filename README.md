# 📚 Student Management System

A simple **MERN + PostgreSQL** project for managing students, built as an interview task.  
The project includes **backend (Node.js + Express + Sequelize + PostgreSQL)** and **frontend (React)**.

---

## 🚀 Features
- Add / Edit / Delete / View students
- Import students via Excel file
- Export students to Excel
- Track actions with audit logs
- Responsive React frontend

---

## ⚙️ Tech Stack
**Backend:**
- Node.js
- Express
- Sequelize ORM
- PostgreSQL

**Frontend:**
- React
- Axios
- TailwindCSS (or plain CSS, depending on your setup)

---

## 📂 Project Structure
student-management-system/
│── server/ # Backend (Node.js + Express)
│ ├── config/ # Database config (db.js)
│ ├── controllers/ # Business logic
│ ├── models/ # Sequelize models
│ ├── routes/ # Express routes
│ └── index.js # Entry point
│
│── client/ # Frontend (React)
│ ├── src/
│ ├── package.json
│ └── ...
│
└── README.md

yaml
Copy code

---

## 🛠️ Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/student-management-system.git
cd student-management-system
2️⃣ Setup Backend
bash
Copy code
cd server
npm install
Make sure PostgreSQL is running locally.

Create a database named student_management in PostgreSQL.

Default DB credentials are already in server/config/db.js:

yaml
Copy code
DB Name: student_management
User: postgres
Password: pattabi
Host: localhost
Dialect: postgres
Start the backend:

bash
Copy code
npm start
Backend runs on http://localhost:5000

3️⃣ Setup Frontend
bash
Copy code
cd ../client
npm install
npm start
Frontend runs on http://localhost:3000

📊 Import & Export
Upload Excel (.xlsx) file to import students

Export student list to Excel with one click

📝 Notes
Credentials are hardcoded in db.js (no .env setup needed) for easy review.

For real-world projects, always use .env for sensitive values.

✅ Ready to Run
Start PostgreSQL

Run backend (server/) → npm start

Run frontend (client/) → npm start

Open browser → http://localhost:3000

🎉 Done! You have a working Student Management System.