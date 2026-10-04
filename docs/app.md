# Learning Guide: app.py (Unified Backend Controller)

---

## A. PURPOSE
`app.py` is the **single unified backend file** of FreelanceGuard.
It contains:
1. Flask web server configuration and URL routing.
2. SQLite database connection and helper queries using Python's built-in `sqlite3`.
3. Google OAuth 2.0 login and Academic Demo quick-login.
4. Simulated Escrow logic and 10% platform fee calculation.
5. In-app notifications and automated Gmail notifications.
6. Role-based views for Client, Freelancer, and Administrator.

---

## B. CONNECTIONS
- **Files that use `app.py`**:
  - The Python runtime: `python app.py` starts the web server.
- **Files that `app.py` uses**:
  - `ai.py`: Calls `extract_requirements_and_milestones()`.
  - `templates/*.html`: Renders all Jinja2 HTML templates.
  - `static/css/style.css` and `static/js/app.js`: Static web assets.
  - `.env`: Loads secrets (`SECRET_KEY`, `GOOGLE_CLIENT_ID`, `GMAIL_SENDER_EMAIL`, etc.).

---

## C. IMPORTANT VARIABLES
- `app`: The Flask WSGI application instance.
- `DB_PATH`: Points to `instance/freelanceguard.db`.
- `session`: Encrypted cookie storage holding `user_id` and `selected_role`.
- `g.db`: Request-scoped SQLite database connection.

---

## D. IMPORTANT FUNCTIONS

### 1. Database Operations
- `get_db()`: Opens or returns the active SQLite connection for the current request.
- `query_db(query, args=(), one=False)`: Executes `SELECT` statements and returns dict-like `sqlite3.Row` objects.
- `execute_db(query, args=())`: Executes `INSERT`, `UPDATE`, or `DELETE` statements, commits changes, and returns the new row ID.
- `log_activity(project_id, user_id, action, description)`: Records audit events in the project timeline.

### 2. Escrow & Financial Operations
- `calculate_fees(amount)`:
  - `platform_fee = round(amount * 0.10, 2)`
  - `freelancer_amount = round(amount - platform_fee, 2)`
- `fund_project_escrow(project_id, client_id)`: Locks the simulated escrow (Status -> `LOCKED`, Project -> `FUNDED`).
- `approve_and_release_milestone(milestone_id, client_id)`: Releases escrow, calculates 10% fee, generates invoice, records simulated payment, and logs to timeline.

### 3. Email Notification
- `send_acceptance_email(...)`: Sends an email to the freelancer upon project acceptance. Includes project name, requirements, budget, deadlines, and the message:
  *"The client can now fund the simulated escrow. You can start working once the escrow is funded."*
  Falls back gracefully to the terminal console if Gmail is not configured.

---

## E. IMPORTANT CODE EXPLAINED LINE-BY-LINE

```python
# Calculate 10% platform fee and 90% payout
def calculate_fees(amount):
    gross = float(amount)
    platform_fee = round(gross * 0.10, 2)
    freelancer_amount = round(gross - platform_fee, 2)
    return {
        "gross": gross,
        "platform_fee": platform_fee,
        "freelancer_amount": freelancer_amount
    }
```
- `gross * 0.10`: Exactly 10% of the milestone value goes to the platform.
- `gross - platform_fee`: Exactly 90% goes to the freelancer.
- `round(..., 2)`: Ensures amounts are clean financial currency values (2 decimal places).

---

## F. LIKELY VIVA QUESTIONS & ANSWERS

**Q1: How does user role isolation work in `app.py`?**  
> *"Through the `@login_required(role)` decorator and session checks. When a client visits `/client-dashboard`, the decorator checks if `user['role'] == 'CLIENT'`. If an unauthorized user attempts access, they are safely redirected."*

**Q2: What is the purpose of the Demo Login routes?**  
> *"The demo login routes (`/auth/demo-login/<role>`) allow instant, offline authentication as Demo Client, Demo Freelancer, or Admin during a live viva presentation, without depending on external Google Cloud redirects or network connectivity."*

**Q3: How is escrow simulated?**  
> *"When the client clicks 'Fund Simulated Escrow', a record is created in `escrow_transactions` with status 'LOCKED'. No money is charged to any bank. When the milestone is approved, the status is updated to 'RELEASED' and an invoice is generated."*
