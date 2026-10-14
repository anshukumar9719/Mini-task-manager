# Mini Task Manager

A simple full-stack task management application.

## Features
- Create tasks
- View all tasks
- View a task by ID
- Update task titles and completion status
- Delete tasks
- Validate inputs and handle errors

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express
- Database: PostgreSQL

## Setup and Installation

1. Install Node.js and PostgreSQL.
2. Clone or download this repository.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure your database credentials in `.env`.
5. Create the required database and table.
6. Start the development server:

   ```bash
   npm run dev
   ```

## Testing
Test task creation, retrieval, updating, deletion, invalid input, nonexistent task IDs, and data persistence after restarting the server.

## Architecture
The frontend sends HTTP requests to the Express REST API. The backend validates requests and reads or writes task records in PostgreSQL.


## Known Limitations
Features and limitations will be updated after testing the completed application.
