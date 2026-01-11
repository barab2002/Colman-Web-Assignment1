# Colman Web – Assignment 2

**Student Names:** Bar Abramovich, Idan Tepper

A robust **RESTful API** for managing Posts and Comments, built with **Node.js, Express, and TypeScript**. This project demonstrates clean architecture, a flexible Data Access Layer (DAL), and full containerization.

---

## 🚀 Features

- **TypeScript**: Fully typed codebase for better maintainability and developer experience.
- **Clean Architecture**: Separation of concerns with Controllers, Services, and DAL.
- **Flexible DAL**: Supports easy switching between **MongoDB** (Production) and **JSON Files** (Dev/Fallback).
- **Swagger UI**: Interactive API documentation automatically generated.
- **Docker Support**: Full `docker-compose` setup for easy deployment.
- **Testing**: Comprehensive Jest test suite and Postman collections.

---

## 🛠️ Prerequisites

- **Node.js** (v18+ recommended)
- **Docker & Docker Compose** (for containerized execution)
- **MongoDB** (local or remote, if running locally without Docker)

---

## 📦 Installation & Running

### Method 1: Docker (Recommended)

The easiest way to run the project. This starts both the API and a MongoDB instance.

```bash
# Build and start the containers
docker-compose up --build
```

- **API URL**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api-docs`

### Method 2: Local Development

If you prefer running directly on your machine:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
    *Ensure `DAL_TYPE=mongo` (or `json`) and `MONGO_URI` are set correctly.*

3.  **Start Database** (if using Mongo):
    ```bash
    npm run mongo:up
    ```

4.  **Start Server**:
    ```bash
    npm run dev
    ```

---

## 📖 API Documentation

We use **Swagger UI** for interactive API documentation.  
Once the server is running, visit:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Key Endpoints

| Resource | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | | | *(If applicable)* |
| **Posts** | `GET` | `/api/post` | Get all posts |
| | `POST` | `/api/post` | Create a new post |
| | `GET` | `/api/post/:id` | Get a specific post |
| **Comments** | `GET` | `/api/post/:id/comments` | Get comments for a post |
| | `POST` | `/api/comment` | Add a comment |

---

## 🧪 Testing

### Unit & Integration Tests (Jest)
Run the automated test suite:

```bash
npm test
```

### Smoke / Postman Tests
Run the Postman collection via Newman:

```bash
npm run smoke
```

---

## 📂 Project Structure

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── dal/            # Data Access Layer (Mongo/JSON implementations)
├── models/         # Data models and interfaces
├── routes/         # Express routes definitions
├── config/         # App configuration (Env, DB, Swagger)
├── db/             # Database connection logic
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

---
