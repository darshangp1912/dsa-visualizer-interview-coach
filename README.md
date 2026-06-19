# DSA Visualizer & Interview Coach

A complete, production-grade web application where users can learn Data Structures and Algorithms (DSA) visually, watch step-by-step animations, test themselves on mock technical interviews directly integrated with visualization modules, and track progress over time on a high-end personal dashboard.

## 🚀 Technology Stack

### Backend
- **Core**: Spring Boot 3.3.0 + Java 21
- **Database**: MySQL 8.0 (Runtime) / H2 (Testing)
- **Security**: Spring Security + JWT Authentication (JJWT 0.12.5)
- **ORM**: Spring Data JPA + Hibernate
- **Build Tool**: Maven

### Frontend
- **Framework**: React.js 18 (Vite + TypeScript)
- **Styling**: TailwindCSS (Custom Dark Themes & Premium Glassmorphism)
- **State/Data**: React Query (TanStack Query v5) + Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 🛠️ Key Features

1. **Dashboard Page**: Real-time metrics showing streak counts, unique problems solved, average quiz accuracy, total points leaderboard standings, unlocked achievements, recent activity logs, and a 7-day activity bar chart.
2. **Algorithms Library**: A search-and-filter interface organizing topics into categories (Sorting, Searching, Trees, Graphs, DP, Stacks, Queues, etc.) showcasing complexity metadata (Best/Avg/Worst/Space).
3. **Visualizer Page**: Interactive, step-by-step sorting and search visualizer engines featuring speed controls, progress markers, and side-by-side pseudocode execution tracing.
4. **Mock Interview Coach**: A modal quiz system containing over 500+ premium questions (MCQs, Coding, Dry Run, Complexity, Optimization) triggered automatically upon visualization completion or manual startup.
5. **Leaderboards & Badges**: Global gamified leaderboards with a 1st/2nd/3rd place podium and automated achievement/badge unlock triggers.

---

## 🐳 Docker Deployment

The entire system is containerized and orchestrated using **Docker Compose**.

### Prerequisites
- Docker Engine & Docker Compose installed locally.

### Start the Services
From the root directory:
```powershell
docker compose up -d --build
```
This command builds and runs three containers:
1. `dsa_mysql`: MySQL Database on port `3306`.
2. `dsa_backend`: Spring Boot backend service on port `8080`.
3. `dsa_frontend`: Nginx serving React production assets on port `3000`.

Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

### Stop the Services
```powershell
docker compose down -v
```

---

## 🛡️ API Endpoints Summary

- **Authentication**: `POST /api/auth/signup`, `POST /api/auth/signin`
- **Algorithms**: `GET /api/algorithms`, `GET /api/algorithms/{id}`
- **Quizzes**: `GET /api/quiz/generate/{algoId}`, `POST /api/quiz/submit`
- **Dashboard**: `GET /api/dashboard/statistics`
- **Leaderboard**: `GET /api/leaderboard`

---

## 🧪 Local Backend Testing
To run unit and integration tests locally inside a Maven-capable environment:
```powershell
docker run --rm -v "${pwd}/backend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn test
```
