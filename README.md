# TurnPoint Software Challenge
**Submitted by: Jo Jefferson Peralta**

A client management web application built with React, Node.js, Express, and MySQL.

## 💡 Assumptions

- **Single vs. Multi-Tenant Database** – For this exercise, the application is assumed to be **single-tenant**, meaning only one company will have access to the database.
- **Multi-Tenant Considerations** – In a multi-tenant database, records (e.g., clients, fundings) would require an additional key for logical separation of data, affecting both API design and authentication mechanisms.
  
- **Scope** – The focus is solely on **client management**. Other setup features (e.g., user login, account management/registration) are assumed to be handled separately.  
- **API Coverage** – The APIs implemented are specific to client and funding management. A list of possible API is listed in a separate section below.
  
- **Initial Client Fields** – The initial version of the software includes specific client fields (e.g. Name, Birthdate, Language).
- **Data Privacy (PDPA)** – Only essential client data is stored, in compliance with **PDPA** guidelines. Fields required for future funding schemes can be easily added to the database, APIs, and UI as the system is designed for extensibility.  
- **Client Info** – Clients may have any birthdate or age, and the name field stores the full legal name.
- **Unique Client Record** - To ensure unique identification and avoid duplicate client records, an **identification ID** (e.g., passport number, national ID, MediCare cards) is included.
- **Language Rules** – The primary (main) language and secondary language must not be the same.
  
- **Fundings** –  
  - The available funding sources are predefined in the database (e.g. NDIS, HCP, DVA, CHSP, HACC). A company can have a different list of supported funding sources.
  - Each funding source may have a unique method for checking eligibility, such as integration with an external API. For simulation purposes, these are stored in the fundings db table (e.g **funding_souces.eligibilityURL, funding_souces.fakeEligibilityResult**).  
  - A client can have only **one primary eligible funding**. Future versions may allow multiple funding sources.  
  - Fundings are optional at client creation to allow saving basic information until a suitable funding source is determined.  
 
- **Record Management** – Clients can be edited or deleted within the application without triggering updates to any external funding system.  

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
**User Interface:**
```bash
http://localhost:3000
```
**APIs:**
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

**Adminer (dev - access to database):**
The database tables are created and seeded with sample data on the first run of the backend application
```bash
http://localhost:8080

Login
System: MySQL
Server: mysql
Username: user
Password: passw0rd
Database: turnpoint_client_db
```

