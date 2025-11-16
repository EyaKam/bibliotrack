# Bibliotrack – University Library Management System

**Fullstack App with Admin Dashboard | Next.js, PostgreSQL, Redis, Auth.js**

Bibliotrack is a production-grade University Library Management System built with modern web technologies. It implements industry-standard practices for scalability, security, and performance. The system handles everything from multi-media uploads, complex database queries, and advanced error handling to automated workflows with custom notifications.

---

## Features

### General

- Fullstack application with a modern Next.js frontend.
- Admin dashboard for managing books, users, and university resources.
- User authentication and authorization via Auth.js.
- Multi-university support with university IDs and cards.
- Responsive design and clean UI.

### Performance & Security

- Caching with Redis for fast response times.
- Rate-limiting and DDoS protection.
- Optimized queries for large datasets.
- Advanced error handling and logging.

### Functionalities

- User registration and login with validation.
- Book catalog browsing and searching.
- Media uploads for book covers and documents.
- Automated notifications for library events.
- Role-based access control (users vs admins).
- Admin dashboard for monitoring system usage.

---

## Tech Stack

- **Frontend**: Next.js (App Router, React 18), Tailwind CSS
- **Backend**: Node.js, Next.js API routes
- **Database**: PostgreSQL via Drizzle ORM
- **Caching**: Redis
- **Authentication**: Auth.js
- **File Uploads**: ImageKit / Custom upload handling
- **Notifications**: Custom server-side workflows
- **Other**: Rate limiting, DDoS protection, optimizations

---

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL
- Redis
- Git

### Installation

1. Clone the repository:
   git clone https://github.com/EyaKam/bibliotrack.git

2. Install dependencies:
   npm install

3. Create `.env.local` and add required environment variables

4. Run database migrations:
   npm run migrate

5. Start the development server:
   npm run dev

6. Open your browser at [http://localhost:3000](http://localhost:3000)

---

## Project Structure

app/ Next.js app router pages and layouts  
components/ Reusable UI components  
database/ Drizzle ORM schema and config  
lib/ Helper functions, validations, actions  
migrations/ Database migrations  
public/ Static assets

---

**Note:** This project was developed as part of a university course/project.
