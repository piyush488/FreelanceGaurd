# FreelanceGuard — Beginner's Syntax & Symbol Glossary

This glossary explains **only the programming symbols and syntax that actually appear in our project code**. It is written in simple, plain English so you can explain them with 100% confidence in your viva.

---

## 1. Python Keywords

| Keyword | Plain English Meaning | Example in FreelanceGuard |
| :--- | :--- | :--- |
| `import` | Loads a Python library or another file so we can use its functions. | `import os, sqlite3` |
| `from ... import ...` | Brings only specific tools from a library instead of importing the whole thing. | `from ai import extract_requirements_and_milestones` |
| `def` | Short for "define". It tells Python: "I am creating a new function here." | `def calculate_fees(amount):` |
| `return` | Sends a result or web page back to whoever called the function. | `return render_template("index.html")` |
| `if` | Checks whether a condition is true before running the code underneath. | `if user_role == "CLIENT":` |
| `elif` | Short for "else if". Checks a second condition if the first `if` was false. | `elif user_role == "FREELANCER":` |
| `else` | Runs if none of the `if` or `elif` conditions were true. | `else: return redirect(...)` |
| `try` / `except` | Catches runtime errors (like network dropouts) so the app does not crash. | `try: client.models... except Exception: fallback()` |
| `with` | A context manager that automatically cleans up resources (like closing connections). | `with smtplib.SMTP_SSL(...) as server:` |
| `None` | Represents "nothing" or "empty" in Python (similar to NULL in databases). | `picture = None` |
| `True` / `False` | Boolean values representing Yes (True) or No (False). | `debug=True` |

---

## 2. Arithmetic & Comparison Operators in Our Code

| Operator | Name | What it Means in Our Code | Example |
| :--- | :--- | :--- | :--- |
| `=` | Assignment | Stores whatever is on the right into the variable on the left. | `platform_fee = gross * 0.10` |
| `==` | Comparison | Checks if two values are equal. Returns `True` or `False`. | `if project['status'] == 'OPEN':` |
| `!=` | Not Equal | Checks if two values are different. | `if status != 'COMPLETED':` |
| `*` | Multiplication | Multiplies numbers. Used for the 10% fee calculation. | `gross * 0.10` (10% of milestone) |
| `-` | Subtraction | Subtracts numbers. Used for 90% payout. | `gross - platform_fee` |
| `+` | Addition | Adds numbers or concatenates strings. | `total = share1 + share2` |
| `/` | Division | Divides numbers. | `budget / 3` |
| `>` / `<` | Greater / Less than | Compares numbers. | `if budget <= 0:` |

---

## 3. Symbols and Punctuation

| Symbol | Name | What it Means in Our Code | Example |
| :--- | :--- | :--- | :--- |
| `:` | Colon | Starts a block of code (functions, if statements, loops). Python indents the lines that follow. | `def login():` |
| `()` | Parentheses | 1. Calls a function.<br>2. Groups arguments together. | `calculate_fees(5000)` |
| `[]` | Square Brackets | 1. Defines a list.<br>2. Looks up a key in a dictionary or session. | `["CLIENT", "FREELANCER"]` or `session["user_id"]` |
| `{}` | Curly Braces | Defines a dictionary (key-value pairs) in Python. | `{"gross": 5000, "fee": 500}` |
| `.` | Dot Operator | Accesses a function or property inside an object. | `session.get("user_role")` |
| `f"..."` | F-String | Formatted string that inserts variables directly into text. | `f"Invoice {invoice_number} created."` |
| `#` | Hash | A comment. Python ignores it. Humans read it to understand code. | `# Calculate 10% fee` |
| `?` | Parameter Placeholder | Used in SQL queries to prevent SQL Injection attacks. | `SELECT * FROM users WHERE id = ?` |
| `@` | Decorator | Attaches special behavior to a function. | `@app.route("/")` |

---

## 4. Flask-Specific Tools & Syntax

| Term | Plain English Meaning | How It Works in Our App |
| :--- | :--- | :--- |
| `@app.route("/path")` | **Route Decorator**. Connects a URL in the browser to a Python function. | When a user visits `http://localhost:5000/`, Flask runs `index()`. |
| `render_template(...)` | Renders an HTML file from the `templates/` folder and passes data to it. | `render_template("invoice.html", invoice=inv)` |
| `redirect(url_for(...))` | Instructs the user's browser to immediately go to another URL. | `return redirect(url_for("client_dashboard"))` |
| `url_for("name")` | Generates the URL for a function name dynamically. | `url_for("index")` produces `"/"`. |
| `session` | A secure, encrypted temporary storage dictionary tied to the user's cookie. | Stores `user_id` so the user stays logged in across pages. |
| `flash("msg", "type")` | Shows a temporary notification banner on the next page the user visits. | `flash("Simulated escrow funded!", "success")` |
| `jsonify({...})` | Converts a Python dictionary into a JSON string for API endpoints. | Used in `/api/analyze-requirements` to return AI data. |
| `request.form` | A dictionary containing all the data submitted by an HTML `<form>`. | Reads input fields like `request.form.get("title")`. |
| `g` | Flask Global Object. Stores data for the lifetime of a single request. | `g.db` stores the active SQLite connection. |

---

## 5. Built-in SQLite3 Methods in Our Code

| Method | What It Does | Why We Use It |
| :--- | :--- | :--- |
| `sqlite3.connect(path)` | Opens a connection to the SQLite database file. | Connects to `instance/freelanceguard.db`. |
| `conn.row_factory = sqlite3.Row` | Configures SQLite to return dictionary-like row objects. | Allows writing `row['title']` instead of index numbers like `row[2]`. |
| `cur.execute(query, args)` | Prepares and executes an SQL statement with parameters. | Safely runs SELECT, INSERT, UPDATE, or DELETE queries. |
| `cur.fetchone()` | Retrieves the first matching record from a query. | Used when looking up a single user or project by ID. |
| `cur.fetchall()` | Retrieves all matching records as a list. | Used when listing all projects in a dashboard. |
| `cur.lastrowid` | Returns the integer ID generated for the row just inserted. | Used to get the newly created `project_id` or `invoice_id`. |
| `conn.commit()` | Saves and commits changes permanently to the database file. | Ensures project creations and status updates persist. |

---

## 6. Jinja2 Template Syntax (Inside HTML)

| Syntax | What It Does | Example in Our HTML |
| :--- | :--- | :--- |
| `{{ variable }}` | **Expression Print**. Inserts the value of a Python variable into the HTML. | `<h1>{{ project.title }}</h1>` |
| `{% if ... %} ... {% endif %}` | **Conditional Rendering**. Only displays the enclosed HTML if true. | `{% if project.status == 'OPEN' %} Accept {% endif %}` |
| `{% extends "base.html" %}` | **Template Inheritance**. Reuses the navbar and footer from `base.html`. | Avoids code duplication across all pages. |
| `{% block content %} ... {% endblock %}` | **Content Block**. Defines the unique section of HTML for each page. | Injects unique dashboard tables into `base.html`. |

---

## 7. JavaScript Syntax (In `app.js`)

| Syntax | What It Does | Why We Use It |
| :--- | :--- | :--- |
| `const` / `let` | Declares variables in JavaScript. | `const btn = document.getElementById("btnAnalyzeAI");` |
| `document.addEventListener(...)` | Listens for events (like page load or button click) and runs a function. | Waits for the HTML to load before running script. |
| `async` / `await` | Pauses execution until an asynchronous operation (like network fetch) completes. | Keeps fetch code readable without messy callbacks. |
| `fetch("/url", {...})` | Sends background HTTP requests to Flask without reloading the page. | Calls Gemini requirement extraction in the background. |
| `setTimeout(fn, ms)` | Executes a function after a delay in milliseconds (1000ms = 1s). | Automatically fades out notification alerts after 5 seconds. |
