# Personal Finance Management API

A RESTful API for a personal finance management application, built with NestJS, Prisma, and Supabase. This application helps you manage your income, expenses, and financial goals.

## Features

- User authentication and management using Supabase.
- CRUD operations for Transactions, Categories, and Goals.
- Type-safe with TypeScript and data validation.
- Prisma ORM for safe and straightforward database interaction.

## Tech Stack

- [NestJS](https://nestjs.com/) - A Node.js framework for building efficient, scalable server-side applications.
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.
- [Supabase](https://supabase.io/) - Open source Firebase alternative for authentication and database.
- [PostgreSQL](https://www.postgresql.org/) - A powerful, open source object-relational database system.
- [Biome](https://biomejs.dev/) - A formatter and linter for web projects.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v22.x or higher)
- [npm](https://www.npmjs.com/)
- A PostgreSQL database instance.

## Environment Variables

Create a `.env` file in the project root and add the following variables. You can copy `template.env` as a starting point.

```bash
# Database connection URL (with pooling) for Prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&pgbouncer=true"

# Direct database connection URL (for Prisma migrations)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Supabase credentials
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
```

## Installation and Setup

1.  Clone the repository:
    ```bash
    git clone <REPOSITORY_URL>
    cd content-calendar-server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up the environment variables as described above.

4.  Run the database migrations:
    ```bash
    npx prisma migrate dev
    ```

5.  (Optional) Generate the Prisma client (usually done automatically post-install):
    ```bash
    npx prisma generate
    ```

## Running the Application

To start the server in development mode with hot-reloading:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`.

### Other Scripts

-   `npm run start`: Starts the application in production mode.
-   `npm run build`: Compiles the application for production.
-   `npm test`: Runs unit tests.
-   `npm run test:e2e`: Runs end-to-end tests.

## Project Structure and Endpoints

The API exposes the following main resources:

-   `src/core/auth`: User authentication.
-   `src/features/users`: User profile management.
-   `src/features/categories`: Management of transaction categories.
-   `src/features/transactions`: Management of income and expense transactions.
-   `src/features/goals`: Management of financial goals.

## Stay in Touch

-   Author - [Andres M. Fajardo](https://x.com/amfajardoo94)
-   Co-author - [Juan Fernando O.](https://www.linkedin.com/in/juan-fernando-otoya/)

## License

This project is closed-source.
