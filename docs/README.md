# FreelanceGuard
## AI-Assisted Freelance Escrow & Invoice Management System
> **Academic Demonstration Project**  
> Built with: Python (Flask), SQLite, Vanilla HTML/CSS/JavaScript, Google Gemini AI, and Google OAuth / Gmail services.

---

## 📌 Project Overview
FreelanceGuard is a two-sided freelance web application connecting **Clients** and **Freelancers** under simulated escrow protection. It demonstrates how modern freelance platforms can eliminate payment disputes, provide automated invoicing, and leverage generative AI to break down project descriptions into clear, sequential milestones.

### Key Highlights:
1. **Minimal Practical Code**: Divided into ONLY TWO Python files (`app.py` for all Flask/database/escrow logic, and `ai.py` for Gemini integration).
2. **Built-in SQLite**: Zero-configuration, file-based relational database using standard Python `sqlite3`.
3. **Gemini AI Integration**: Converts unstructured client descriptions into numbered deliverables and suggested milestones with budget allocations.
4. **Simulated Escrow Protection**: Client funds simulated escrow (status becomes `LOCKED`), and funds are released sequentially as deliverables are approved.
5. **10% Platform Fee & Automated Invoicing**: Automatically deducts a 10% platform fee and credits 90% net payout to the freelancer, instantly generating a formal invoice.
6. **Dispute Resolution**: Enables dispute escalation to an Administrator dashboard for release or refund rulings.
7. **Offline Viva Demo Mode**: Includes one-click demo login buttons for Client, Freelancer, and Admin so presentations succeed even without active WiFi!

---

## 🛠️ Technology Stack

| Component | Technology | Viva Justification |
| :--- | :--- | :--- |
| **Backend** | Python 3, Flask | Simple routing, minimal boilerplate, high readability. |
| **Database** | SQLite3 (Built-in) | Relational SQL database stored in a single file with zero server setup. |
| **Frontend** | HTML5, Vanilla CSS, Minimal Vanilla JS | Modern glassmorphism, micro-animations, no heavy JS frameworks or build steps. |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash`) | Structured requirement extraction and milestone planning. |
| **Auth** | Google OAuth 2.0 & Demo Mode | Secure passwordless login with instant offline demo fallback. |
| **Notifications**| Gmail SMTP & In-App Alerts | Real transactional emails with automatic console logging fallback. |

---

## 📁 Project Structure

```text
stickit/
├── app.py                     # All Flask routes, SQLite operations, Escrow, Auth & Email
├── ai.py                      # Google Gemini API requirement extraction helper
├── requirements.txt           # Python dependencies list
├── .env.example               # Template for environment secrets
├── .env                       # Local secrets configuration
├── .gitignore                 # Files excluded from git
├── README.md                  # Project setup and documentation
├── VIVA_NOTES.md              # 35+ Viva Questions and Simple Answers
│
├── templates/                 # Jinja2 HTML templates
│   ├── base.html              # Shared layout & Academic Simulation banner
│   ├── index.html             # Role selection landing page
│   ├── login.html             # Google OAuth login & Viva quick-login
│   ├── client_dashboard.html  # Client overview & metrics
│   ├── create_project.html    # Form with AI Analyze button & milestones
│   ├── client_project.html    # Client project manager (fund, approve, dispute)
│   ├── freelancer_dashboard.html # Freelancer job catalog & earnings
│   ├── freelancer_project.html   # Freelancer project view & deliverable submission
│   ├── invoice.html           # Official printable invoice (10% fee, 90% net)
│   └── admin_dashboard.html   # Admin dispute resolution dashboard
│
├── static/
│   ├── css/style.css          # Design system with CSS variables & micro-animations
│   └── js/app.js              # Vanilla JS for AI fetch & dynamic milestone builder
│
├── docs/                      # Complete Beginner Learning Guides
│   ├── SYNTAX_GLOSSARY.md     # Plain-English glossary of every keyword/symbol used
│   ├── PYTHON_GUIDE.md        # Beginner guide to Python in our app
│   ├── SQL_GUIDE.md           # Beginner guide to SQLite & database queries
│   ├── HTML_JINJA_GUIDE.md    # Beginner guide to HTML & Jinja2 templates
│   ├── CSS_GUIDE.md           # Beginner guide to CSS design & animations
│   ├── JAVASCRIPT_GUIDE.md    # Beginner guide to Vanilla JavaScript & fetch
│   ├── app.md                 # Complete learning guide for app.py
│   ├── ai.md                  # Complete learning guide for ai.py
│   ├── templates.md           # Learning guide for templates
│   └── style_css.md           # Learning guide for style.css
│
└── instance/
    └── freelanceguard.db      # SQLite database file (created automatically)
```

---

## 🚀 Setup & Running Instructions (Windows / VS Code)

### Step 1: Open the Project in VS Code
Open the project directory in VS Code or any terminal:
```bash
cd c:\Users\Lenovo\stickit
```

### Step 2: Install Dependencies
Install the minimal dependencies from `requirements.txt`:
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` (already done by default):
```bash
# If you have a Gemini API key from https://aistudio.google.com/, add it to .env:
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you leave `GEMINI_API_KEY` blank, the app will automatically use its built-in intelligent rule-based parser for offline viva demonstrations!)*

### Step 4: Run the Application
Start the Flask web server:
```bash
python app.py
```

### Step 5: Open in Your Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000/
```

---

## 🎬 Complete Viva Demo Walkthrough

1. **Role Selection**: Open `http://127.0.0.1:5000/`. Select **Continue as Client**.
2. **Instant Demo Login**: Click **Instant Login as Demo Client** (or use Google Login).
3. **Create Project with AI**:
   - Click **+ Post New Project**.
   - Enter title: `Mobile Food Delivery App` and budget: `10000`.
   - In description, write: `I need a food delivery website with user login, restaurant menu catalog, cart, checkout, driver tracking, and admin dashboard.`
   - Click **✨ Analyze Requirements with AI**.
   - Gemini automatically extracts 6 structured requirements and creates 3 sequential milestones with deadlines!
   - Click **Submit Project Request**.
4. **Switch to Freelancer**:
   - Click **Logout**, then select **Continue as Freelancer** -> **Instant Login as Demo Freelancer**.
   - Under Available Project Requests, click **View Requirements & Accept**.
   - See the exact client requirements and click **Accept Project**.
   - Notice the terminal logs the automated notification email!
5. **Fund Simulated Escrow**:
   - Log back in as Client.
   - On the project page, notice the prompt: Click **Fund Simulated Escrow (₹10,000)**.
   - Escrow status updates to **LOCKED**.
6. **Submit Milestone Deliverable**:
   - Log back in as Freelancer.
   - Under Milestone 1, fill in the submission note and project repository link.
   - Click **Submit Deliverable**. Status updates to **SUBMITTED**.
7. **Approve Milestone & Generate Invoice**:
   - Switch to Client.
   - Click **✓ Approve Deliverable & Release Escrow**.
   - The platform calculates the 10% platform fee (₹1,000) and releases 90% net (₹9,000) to the freelancer.
   - An official Invoice is generated! Click to view and print the invoice.
8. **Dispute Resolution Demo**:
   - On Milestone 2, click **Raise Dispute**.
   - Log in as **Platform Admin** (`/auth/demo-login/admin`).
   - Admin reviews the dispute and clicks **Rule in Favor of Freelancer** or **Refund to Client**.
