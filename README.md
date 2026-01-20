# Colman Web – Assignment 2

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

**Student Names:** Bar Abramovich, Idan Tepper

A robust **RESTful API** for managing Posts, Comments, and Users, built with **Node.js, Express, and TypeScript**. This project demonstrates clean architecture, a flexible Data Access Layer (DAL), and full containerization with authentication.

---

## 🚀 Features

- **Authentication**: Secure JWT-based authentication (Login, Register, Refresh Token).
- **Clean Architecture**: Modular design separating Controllers, Services, Models, and DAL.
- **Flexible DAL**: Supports switching between **MongoDB** (Production) and **JSON Files** (Dev/Fallback).
- **TypeScript**: Fully typed codebase for reliability and maintainability.
- **Swagger UI**: Interactive API documentation.
- **Docker Support**: Containerized environment using `docker-compose`.
- **Testing**: Includes Jest unit tests and Postman smoke tests.

---

## 🛠️ Prerequisites

- **Node.js** (v18+ recommended)
- **Docker & Docker Compose** (for containerized execution)
- **MongoDB** (if running locally without Docker)

---

## 📦 Installation & Running

### Method 1: Docker (Recommended)

The easiest way to run the full stack (App + MongoDB).

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
    Create a `.env` file based on the example:
    ```bash
    cp .env.example .env
    ```
    *Make sure `MONGO_URI` is correct for your local setup.*

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

**Interactive Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Endpoints Overview

#### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive Access/Refresh tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout user |

#### 👤 Users (`/users`)
*Requires Authentication header*
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:userId` | Get specific user details |
| `PUT` | `/api/users/:userId` | Update user details |
| `DELETE` | `/api/users/:userId` | Delete a user |

#### 📝 Posts (`/post`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/post` | Get all posts |
| `POST` | `/api/post` | Create a new post |
| `GET` | `/api/post/:postId` | Get a specific post |
| `PUT` | `/api/post/:postId` | Update a post |
| `GET` | `/api/post/:postId/comments` | Get comments for a post |

#### 💬 Comments (`/comment`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/comment` | Add a comment |
| `GET` | `/api/comment/:commentId` | Get a specific comment |
| `PUT` | `/api/comment/:commentId` | Update a comment |
| `DELETE` | `/api/comment/:commentId` | Delete a comment |

#### 🏥 System Health
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health/mongo` | Check MongoDB connection status |

---

## 🧪 Testing

### Automated Tests (Jest)
Run unit and integration tests:
```bash
npm test
```

### Smoke Tests (Postman)
To run the included Postman collection against a running server:
```bash
npm run smoke
```

---

## 📂 Project Structure

```
src/
├── app.ts          # App configuration
├── server.ts       # Server entry point
├── config/         # System config (Swagger, DB)
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Mongoose models & Interfaces
├── dal/            # Data Access Layer (Mongo & FS)
├── routes/         # Express routes
├── middleware/     # Auth & Validation middleware
└── scripts/        # Utility scripts
```

---

## 👥 Authors
*   **Bar Abramovich**
*   **Idan Tepper**
