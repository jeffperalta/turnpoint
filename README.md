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
```
```bash
Folder Structure:
turnpoint/
├── backend/
│   └── .env 
├── frontend/
│   └── .env
├── mysql-db/
│   └── docker-compose.yml
```
## ⚙️ Setup Environment file (backend)
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=passw0rd
DB_NAME=turnpoint_client_db
PORT=5001
```

## ⚙️ Setup Environment file (frontend)
```bash
REACT_APP_API_BASE_URL=http://localhost:5001
```

## 🚀 Run
```bash
cd turnpoint
npm install

cd backend
npm install
npm run dev

cd ../frontend
npm install
npm start

cd ../mysql-db
docker-compose up -d  
```
