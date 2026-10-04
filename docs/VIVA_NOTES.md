# FreelanceGuard — Comprehensive Viva Voce Guide & 35+ Questions

---

## 🎯 1. The 60-Second Elevator Pitch (Memorize This!)

> *"Good morning, Sir/Ma'am. My project is **FreelanceGuard: AI-Assisted Freelance Escrow & Invoice Management System**.*
> 
> *The traditional freelance market suffers from two major problems: payment disputes due to unverified deliverables, and ambiguous, poorly defined project requirements.*
> 
> *FreelanceGuard solves these problems with three core innovations:*
> 1. *It uses **Google Gemini AI** to convert unstructured client descriptions into structured, numbered deliverables and sequential milestones.*
> 2. *It implements a **Simulated Escrow mechanism**, where client funds are locked upfront and released sequentially only when each milestone deliverable is approved.*
> 3. *Upon approval, it automatically calculates a **10% platform service fee**, credits **90% net payout** to the freelancer, generates an **official digital invoice**, and maintains a tamper-evident **activity audit timeline**.*
> 
> *The system is developed using Python, Flask, built-in SQLite, Google Gemini AI, and Vanilla HTML/CSS/JavaScript with zero bloated enterprise dependencies."*

---

## 🔄 2. End-to-End Data Flow

```
[User Action in Browser]
       │
       ▼
[HTML Form / JavaScript fetch()]
       │
       ▼  (HTTP POST / JSON Request)
[Flask Route in app.py]
       │
       ├─► [Gemini AI (ai.py)] ──► Parses description into JSON requirements/milestones
       ├─► [SQLite DB (sqlite3)] ──► INSERT/UPDATE projects, milestones, escrow, invoices
       └─► [Gmail Notification] ──► Dispatches automated email to freelancer
       │
       ▼
[Rendered HTML Template / JSON Response]
       │
       ▼
[Browser Updates UI with Flash Message, Status Badge & Timeline]
```

---

## 💡 3. Top 35 Viva Questions & Simple Answers

### Category 1: Project Concept & Architecture

**Q1: What problem does FreelanceGuard solve?**  
> *"It solves payment insecurity in freelance contracting. Clients fear paying before work is done, while freelancers fear working without guaranteed payment. Our simulated escrow locks the funds upfront and releases them milestone by milestone upon verified delivery."*

**Q2: Why did you divide the backend into only two Python files (`app.py` and `ai.py`)?**  
> *"To maintain maximum code readability and avoid over-engineering. `app.py` handles web routes, database operations, and business logic, while `ai.py` isolates the external Gemini API integration. This makes the codebase clean and straightforward to study for viva examination."*

**Q3: Is real money transferred in this system?**  
> *"No, sir/ma'am. This is an academic demonstration prototype. The escrow is completely simulated using internal database states (`LOCKED`, `RELEASED`, `REFUNDED`), and a prominent academic notice is displayed on every page to make this clear."*

**Q4: What are the primary user roles in the system?**  
> *"Three roles: **Client** (posts jobs, funds escrow, approves deliverables), **Freelancer** (browses jobs, accepts contracts, submits deliverables), and **Admin** (monitors platform fees and resolves escalated milestone disputes)."*

**Q5: What is the fee structure of the platform?**  
> *"The platform takes a flat 10% service fee from every approved milestone amount, and the remaining 90% is credited to the freelancer. For example, for a ₹5,000 milestone deliverable, the platform fee is ₹500 and the freelancer receives ₹4,500."*

---

### Category 2: Python & Flask Implementation

**Q6: What is Flask and why was it preferred over Django?**  
> *"Flask is a lightweight Python WSGI micro-framework. Unlike Django, which forces complex ORM models, migrations, and administrative overhead, Flask gives us total control to write simple, direct Python functions and raw SQL queries."*

**Q7: How does routing work in Flask?**  
> *"Through decorators like `@app.route('/login')`. Flask maps the incoming browser URL path to the decorated Python function and executes it."*

**Q8: What is the difference between `render_template` and `redirect`?**  
> *"`render_template` takes an HTML file, injects Python variables into it, and returns the generated HTML page. `redirect` instructs the browser to make a new HTTP request to a completely different route (e.g. after a form submission)."*

**Q9: What is the purpose of `app.config['SECRET_KEY']`?**  
> *"Flask uses the secret key to cryptographically sign session cookies. This prevents malicious users from tampering with cookie data to fake their login ID or role."*

**Q10: What does the `@login_required` decorator do?**  
> *"It inspects the current session before running a route. If the user is not logged in or lacks the required role (e.g. a freelancer trying to access client actions), it halts execution and redirects them safely."*

---

### Category 3: Database & SQLite

**Q11: Why did you use SQLite instead of MySQL or MongoDB?**  
> *"SQLite is serverless, zero-configuration, and built directly into Python's standard library. The database is stored in a single portable file (`instance/freelanceguard.db`), eliminating external database setup during demonstrations."*

**Q12: How do you prevent SQL Injection attacks?**  
> *"By using parameterized queries with `?` placeholders (e.g. `execute_db('SELECT * FROM users WHERE email = ?', (email,))`). SQLite treats the parameters strictly as literal data, preventing malicious SQL code execution."*

**Q13: What does `sqlite3.Row` do?**  
> *"Setting `conn.row_factory = sqlite3.Row` allows query results to be accessed by column name (like a dictionary, e.g. `row['budget']`) rather than tuple indices (`row[4]`), making the code far more readable."*

**Q14: Explain Primary Key and Foreign Key in your schema.**  
> *"A Primary Key (like `projects.id`) uniquely identifies each row in a table. A Foreign Key (like `projects.client_id`) references the Primary Key of another table (`users.id`) to establish relational integrity."*

**Q15: How many tables are there in the database?**  
> *"Ten simple tables: `users`, `projects`, `requirements`, `milestones`, `escrow_transactions`, `invoices`, `payments`, `disputes`, `notifications`, and `activity_logs`."*

---

### Category 4: Generative AI (Gemini)

**Q16: What is the exact role of Gemini AI in this project?**  
> *"Gemini is used strictly for requirement extraction and milestone structuring. When a client enters a project description, Gemini converts it into clear, bulleted deliverables and suggests sequential milestones with deadlines and budget allocations."*

**Q17: Why did you restrict AI from approving milestones or releasing funds?**  
> *"For safety, determinism, and financial accountability. AI models are probabilistic and should never make financial decisions. Escrow releases and approvals must remain 100% under human control (the client and admin)."*

**Q18: What happens if the Gemini API key is missing or the college network is down?**  
> *"The code in `ai.py` wraps the API call in a `try...except` block. If the API fails or no key is present, it automatically activates an intelligent local text-parsing fallback function, ensuring the demo never crashes during viva."*

**Q19: Which Gemini model is used and how is it called?**  
> *"We use `gemini-2.5-flash` through Google's official `google-genai` Python SDK, passing an engineered prompt requesting structured JSON output."*

---

### Category 5: Authentication & Email

**Q20: How does Google OAuth 2.0 work in this project?**  
> *"The user is redirected to Google's consent screen. Upon granting permission, Google sends an authorization code to our callback route. Flask exchanges that code for an access token, fetches the user's name and email, and establishes a secure session."*

**Q21: Why do you store Google ID instead of passwords?**  
> *"Storing user passwords creates high security risks. By using Google OAuth, Google handles password encryption and multi-factor authentication, while our database only needs to store the user's public Google ID, name, email, and role."*

**Q22: What is the Offline Demo Login feature?**  
> *"It provides instant one-click login buttons for Demo Client, Demo Freelancer, and Platform Admin. This allows an examiner to test all roles immediately without needing external internet or live Google OAuth configuration."*

**Q23: How does the automated email notification work?**  
> *"When a freelancer accepts a project, `send_acceptance_email()` dispatches an email via Gmail SMTP containing the project details, milestones, and the notice that work may begin once escrow is funded. If credentials are not set, it prints the complete formatted email to the terminal console without crashing."*

---

### Category 6: Escrow, Milestones & Disputes

**Q24: What are the lifecycle statuses of a project?**  
> *"`OPEN` (posted by client) -> `ACCEPTED` (freelancer agreed) -> `FUNDED` (escrow locked) -> `IN_PROGRESS` (work started) -> `COMPLETED` (all milestones approved) or `DISPUTED` (under admin review)."*

**Q25: What are the lifecycle statuses of a milestone?**  
> *"`PENDING` -> `IN_PROGRESS` -> `SUBMITTED` -> `APPROVED` (or `REVISION_REQUESTED` / `DISPUTED`) -> `RELEASED`."*

**Q26: What happens when a client clicks 'Request Revision'?**  
> *"The milestone status changes to `REVISION_REQUESTED`, the client's feedback note is saved, an in-app notification is sent to the freelancer, and the freelancer is given the option to re-submit deliverables."*

**Q27: How does Dispute Resolution work?**  
> *"If a client is dissatisfied, they can raise a dispute. The contract is escalated to the Admin Dashboard. The administrator reviews the deliverables and can issue one of two rulings: **Release to Freelancer** (releases funds minus 10% fee) or **Refund to Client** (refunds simulated escrow back to the client)."*

**Q28: When is an Invoice generated?**  
> *"An invoice is generated automatically the moment a milestone is approved (or resolved by admin). It records the unique invoice number, client details, freelancer details, gross milestone value, 10% platform fee, and 90% net payout."*

---

### Category 7: Frontend & JavaScript

**Q29: Why did you avoid using React or Angular?**  
> *"React introduces complex virtual DOM abstractions, state managers, and node build steps that add bloat to an academic demo. Standard HTML, CSS, and minimal Vanilla JS provide a fast, responsive UI that is easy to explain line by line."*

**Q30: What does `fetch()` do in `static/js/app.js`?**  
> *"It sends an asynchronous HTTP POST request to `/api/analyze-requirements` in the background. This allows Gemini to analyze the description and dynamically insert requirements into the active form without reloading the page."*

**Q31: How are CSS variables used in `style.css`?**  
> *"They are defined in `:root` (e.g. `--primary: #4f46e5`, `--success: #10b981`) to maintain consistent color branding across cards, buttons, and status badges, allowing global style changes in a single line."*

**Q32: How are animations implemented without external animation libraries?**  
> *"Using pure CSS `@keyframes` (like the pulse dot animation on the Academic Demonstration banner) and CSS transitions (`transition: all 0.25s`) on button and card hover states."*

---

### Category 8: Security & Best Practices

**Q33: How does the application prevent unauthorized role access?**  
> *"Every sensitive route is protected by `@login_required('CLIENT')` or `@login_required('FREELANCER')`. If an active session does not have the required role, access is rejected immediately."*

**Q34: How does the Activity Timeline prevent tampering?**  
> *"Every significant state transition (project creation, acceptance, escrow funding, submission, approval, revision, dispute) triggers an internal `log_activity()` call that inserts an immutable audit log record with a server-generated timestamp."*

**Q35: If a teacher asks: 'Can you show me the code that calculates the platform fee?', where do you point?**  
> *"In `app.py`, right inside the `calculate_fees(amount)` function:
> ```python
> platform_fee = round(gross * 0.10, 2)
> freelancer_amount = round(gross - platform_fee, 2)
> ```
> It calculates the exact 10% fee and 90% payout in two clean, readable lines."*
