# 📊 Finance Dashboard

```text
  _   __ _  __  _____  _                              
 | | / /| |/ / |  ___|(_) _ __    __ _  _ __    ___  ___ 
 | |/ / | ' /  | |_   | || '_ \  / _` || '_ \  / __|/ _ \
 | |\ \ | . \  |  _|  | || | | || (_| || | | || (__|  __/
 \_| \_\|_|\_\ |_|    |_||_| |_| \__,_||_| |_| \___|\___|
```

A modern, full-stack Finance Data Processing and Access Control Dashboard built for speed and precision.

## 🚀 Tech Stack

**Backend:**
- Java 21, Spring Boot 3.3.0
- Spring Security 6, JWT Authentication
- Spring Data JPA
- MySQL 8

**Frontend:**
- Vite, React 18
- Tailwind CSS v3
- Recharts, Lucide Icons, React Router v6, Axios

## 🛠 Prerequisites

- Node.js 18+
- Java 21+
- Maven 3.8+
- MySQL 8

## ⚙️ Backend Setup

1. Create a MySQL database named `finance_db`.
   ```sql
   CREATE DATABASE finance_db;
   ```
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Update `src/main/resources/application.properties` with your MySQL credentials, if different from `root`/`root`.
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The server will start on http://localhost:8080*

## 🎨 Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Verify package.json is installed properly:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The client will start on http://localhost:5173*

## 🔑 Default Credentials

A data seeder automatically initializes testing accounts and transaction history upon the first run:

| Role    | Email                 | Password    | Access Level             |
| ------- | --------------------- | ----------- | ------------------------ |
| ADMIN   | `admin@finance.com`   | `admin123`  | Full CRUD, User Mgmt     |
| ANALYST | `analyst@finance.com` | `analyst123`| Read-Only Dashboard/Recs |
| VIEWER  | `viewer@finance.com`  | `viewer123` | Read-Only Dashboard/Recs |

## 📡 API Reference

### Authentication
| Method | Endpoint             | Auth       | Description                   |
| ------ | -------------------- | ---------- | ----------------------------- |
| POST   | `/api/auth/register` | Public     | Register a new Viewer user    |
| POST   | `/api/auth/login`    | Public     | Get JWT token                 |

### Dashboard
| Method | Endpoint                        | Auth       | Description                                |
| ------ | ------------------------------- | ---------- | ------------------------------------------ |
| GET    | `/api/dashboard/summary`        | All Roles  | Net balance, total income/expense stats    |
| GET    | `/api/dashboard/category-totals`| All Roles  | Grouped totals for donut/bar charts        |
| GET    | `/api/dashboard/monthly-trends` | All Roles  | Aggregated data by month for bar trends    |
| GET    | `/api/dashboard/recent-activity`| All Roles  | Last 5 non-deleted transactions            |

### Financial Records
| Method | Endpoint              | Auth       | Description                                  |
| ------ | --------------------- | ---------- | -------------------------------------------- |
| GET    | `/api/records`        | All Roles  | Paginated, filterable list of records        |
| GET    | `/api/records/{id}`   | All Roles  | Single record by ID                          |
| POST   | `/api/records`        | All Roles  | Create a new transaction record              |
| PUT    | `/api/records/{id}`   | ADMIN      | Update an existing transaction               |
| DELETE | `/api/records/{id}`   | ADMIN      | Soft delete a transaction record             |

### User Management
| Method | Endpoint               | Auth       | Description                               |
| ------ | ---------------------- | ---------- | ----------------------------------------- |
| GET    | `/api/users`           | ADMIN      | List all registered users                 |
| GET    | `/api/users/{id}`      | ADMIN      | Get single user details                   |
| PUT    | `/api/users/{id}/role` | ADMIN      | Elevate/downgrade roles                   |
| PUT    | `/api/users/{id}/status`| ADMIN     | Activate/Deactivate access                |
| DELETE | `/api/users/{id}`      | ADMIN      | Hard delete a user                        |

## 🧩 Design Decisions & Assumptions

- **Soft Deletion:** Financial records use a `deleted=true` flag. They are excluded from analytics instead of hard-deleting, maintaining referential integrity history.
- **Micro Frontend Styling:** Used utility composition closely wrapped into functional React Components (like `<Badge>`, `<SummaryCard>`) without inflating global stylesheets.
- **Custom Fonts:** Utilized `Syne` and `DM Sans` for premium readability, injecting directly into HTML via Google Fonts.
- **Data Hydration:** Recharts requires data arrays shaped distinctly; the backend calculates this aggregation (`DashboardService`) directly using Java streams rather than complex DB grouping to maximize caching applicability later.
