# Colman Web – Assignment
## Bar Abramovich and Idan Tepper
**REST API for Posts & Comments (TypeScript + Express + MongoDB / JSON DAL)**

---

## 📌 Overview

This project is a **RESTful backend API** built with **Node.js, Express, and TypeScript**.  
It supports managing **Posts** and **Comments**, with a flexible **Data Access Layer (DAL)** that can work either with:

- **MongoDB** (primary / production mode)
- **JSON file storage** (local / fallback mode)

The project follows **clean architecture principles**, with clear separation of concerns and real-world backend practices.

---

## Architecture

```
/src
├── app.ts
├── server.ts
├── /db
│   └── mongoClient.ts
├── /models
│   ├── post.model.ts
│   └── comment.model.ts
├── /routes
│   ├── post.router.ts
│   ├── comment.router.ts
│   ├── health.router.ts
│   └── index.ts
├── /services
│   ├── post.service.ts
│   └── comment.service.ts
├── /types
│   └── swagger-ui-express.d.ts
/scripts
├── ensure-mongo.js
postman
rest.rest
```

---

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB
- Docker & Docker Compose
- Postman / VS Code REST Client

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
DAL_TYPE=mongo
MONGO_URI=mongodb://mongo:27017/colman
```

---

## Running the Project

### Docker (Recommended)

```bash
docker-compose up --build
```

API:
```
http://localhost:3000
```

---

### Local

```bash
npm install
npm run dev
```

---

## API Endpoints

### Posts
- POST `/api/post`
- GET `/api/post`
- GET `/api/post/:id`
- PATCH `/api/post/:id`

### Comments
- POST `/api/comment`
- GET `/api/comment/:id`
- PATCH `/api/comment/:id`
- DELETE `/api/comment/:id`
- GET `/api/post/:id/comments`


## Assignment Notes

- REST API
- MongoDB
- Docker
