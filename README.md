# TurnPoint Software Challenge
## Name: Jo Jefferson Peralta

A client management web application built with React, Node.js, Express, and MySQL.

## 📦 Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) v22  
- [npm](https://www.npmjs.com/) v10+
- [Docker](https://www.docker.com/) v20+  
- [Docker Compose](https://docs.docker.com/compose/) v2+

## 💾 Download & Install
```bash
git clone https://github.com/jeffperalta/turnpoint.git
cd turnpoint
npm install

cd backend
npm install

cd ../frontend
npm install
```
```bash
Folder Structure:
turnpoint/
├── backend/
│   └── node_modules 
│   └── .env 
├── frontend/
│   └── node_modules 
│   └── .env
├── mysql-db/
│   └── docker-compose.yml
```
## ⚙️ Setup Environment file (backend .env)
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=passw0rd
DB_NAME=turnpoint_client_db
PORT=5001
```

## ⚙️ Setup Environment file (frontend .env)
```bash
REACT_APP_API_BASE_URL=http://localhost:5001
```

## 🚀 Run Application
```bash
cd mysql-db
docker-compose up -d

cd ../backend
npm run dev

cd ../frontend
npm start
```

## 🌐 Applications
User Interface:
```bash
http://localhost:3000
```
APIs:
```bash
Client Resource:
GET    /api/clients
GET    /api/clients/:id
POST   /api/clients
PUT    /api/clients/:id
DELETE /api/clients/:id

Funding Resource:
GET   /api/fundings
POST  /api/fundings/check-eligibility
```

Adminer (dev - access to database):
```bash
http://localhost:8080

Login
System: MySQL
Server: mysql
Username: user
Password: passw0rd
Database: turnpoint_client_db
```

