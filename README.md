# 📊 json2sql

> "Transform nested JSON into structured SQL and CSV with ease."

`json2sql` is a powerful utility designed to bridge the gap between flexible JSON data and structured relational databases. It supports graceful nesting, automatic header detection, and provides a seamless conversion process for developers and data analysts.

## ✨ Features

- **Graceful Nesting Support**: Handles complex, deeply nested JSON structures and flattens them for SQL/CSV compatibility.
- **Multi-Format Export**: Convert JSON directly to SQL `INSERT` statements or CSV files with accurate headers.
- **Modern Tech Stack**: Built with TypeScript, React, and Vite for a fast, responsive user experience.
- **Database Ready**: Integrated with Drizzle ORM and PostgreSQL support for direct database pushes.
- **Stripe Integration**: Ready for commercial use with built-in Stripe payment processing.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Express.js, Node.js.
- **Database**: PostgreSQL, Drizzle ORM, Neon Database.
- **Authentication**: Passport.js (Local strategy).
- **Payments**: Stripe.

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lowcache/json2sql.git
   cd json2sql
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file based on the provided structure.

4. Run in development mode:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## 🗄️ Database Management

Push your schema to the database using Drizzle:
```bash
npm run db:push
```

---
*lowcache 2026*
