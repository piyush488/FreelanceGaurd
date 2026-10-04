# SQL & Database Guide for Viva (FreelanceGuard)

This guide explains **relational database concepts, SQLite, table relationships, and SQL queries** used in `app.py`.

---

## 1. What is SQLite and Why Did We Use It?
- **SQLite** is a lightweight, file-based relational database management system (RDBMS) built directly into Python.
- **Why we used it**:
  - No database server installation or credentials required (like MySQL or PostgreSQL).
  - The entire database is stored in a single file (`instance/freelanceguard.db`), making it 100% portable for project presentations.
  - Zero performance lag and zero configuration.

---

## 2. Key Database Concepts Explained Simply

### A. Primary Key (`PRIMARY KEY AUTOINCREMENT`)
- A unique identifier for every row in a table.
- Example: Every project has an `id` (1, 2, 3...) that never repeats.

### B. Foreign Key (`FOREIGN KEY`)
- A column that links a record in one table to the primary key of another table.
- Example: `projects.client_id REFERENCES users(id)` tells SQLite that the project was created by that specific user.

### C. Relational Integrity (`PRAGMA foreign_keys = ON;`)
- SQLite enables foreign key validation when this pragma command is executed, preventing orphan rows.

---

## 3. The 10 Database Tables in Our Project

| Table Name | Purpose | Key Columns |
| :--- | :--- | :--- |
| `users` | Stores accounts for Clients, Freelancers, and Admin. | `id`, `google_id`, `name`, `email`, `role` |
| `projects` | Stores freelance jobs posted by Clients. | `id`, `client_id`, `freelancer_id`, `title`, `budget`, `status` |
| `requirements` | Stores individual deliverables extracted by Gemini AI. | `id`, `project_id`, `description` |
| `milestones` | Stores sequential milestones with amount and deadline. | `id`, `project_id`, `title`, `amount`, `deadline`, `status` |
| `escrow_transactions`| Stores simulated escrow deposits and statuses (`LOCKED`/`RELEASED`). | `id`, `project_id`, `amount`, `status` |
| `invoices` | Official record generated when a milestone is approved. | `id`, `invoice_number`, `gross_amount`, `platform_fee`, `freelancer_amount` |
| `payments` | Records simulated settlements. | `id`, `invoice_id`, `sender_id`, `receiver_id`, `amount` |
| `disputes` | Stores disputes raised on milestones for Admin review. | `id`, `project_id`, `milestone_id`, `reason`, `status` |
| `notifications` | In-app alerts shown in dashboards. | `id`, `user_id`, `title`, `message`, `is_read` |
| `activity_logs` | Audit trail of every action in the project timeline. | `id`, `project_id`, `user_id`, `action`, `description` |

---

## 4. SQL Statements Used in Our Code

### 1. SELECT (Read Data)
```sql
SELECT * FROM projects WHERE client_id = ? ORDER BY id DESC;
```
- Fetches all projects belonging to the logged-in client, newest first.

### 2. INSERT (Create Data)
```sql
INSERT INTO projects (client_id, title, description, budget, deadline, status)
VALUES (?, ?, ?, ?, ?, 'OPEN');
```
- Adds a new row to the `projects` table.

### 3. UPDATE (Modify Data)
```sql
UPDATE projects SET status = 'FUNDED' WHERE id = ?;
```
- Changes the project status from `ACCEPTED` to `FUNDED` when escrow is locked.

### 4. Parameterized Queries (`?` placeholders)
- Notice we use `?` instead of formatting strings directly (e.g. `f"SELECT * FROM users WHERE email='{email}'"`).
- **Viva explanation**: Using `?` placeholders prevents **SQL Injection attacks** by having SQLite automatically escape all user inputs.

---

## 5. Top SQL Viva Questions

**Q1: Why did we choose SQLite over MongoDB or PostgreSQL?**  
> *"SQLite is serverless, zero-configuration, and built into Python's standard library. It provides full relational ACID guarantees and foreign key support without requiring an external database server during the academic demonstration."*

**Q2: What is the difference between `fetchone()` and `fetchall()`?**  
> *"`fetchone()` retrieves a single matching record (or None), while `fetchall()` retrieves all matching records as a list."*

**Q3: What does `sqlite3.Row` do?**  
> *"It allows column access by name (e.g. `project['title']`) instead of numeric indices (e.g. `project[3]`), making the code clean and readable."*
