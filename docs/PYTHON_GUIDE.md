# Python Programming Guide for Viva (FreelanceGuard)

This guide covers **every Python concept, function, and technique** used in `app.py` and `ai.py`. It is written in simple, plain English so you can explain your code with complete confidence.

---

## 1. What is Python and Why Did We Use It?
- **Python** is a high-level, interpreted programming language known for its clean syntax and readability.
- **Why we used it**: Python reads almost like plain English. In this project, business logic like calculating a 10% platform fee, managing user sessions, and executing database queries can be written in just a few direct lines without verbose boilerplate.

---

## 2. Core Python Syntax & Concepts in Our Code

### A. Functions (`def` and `return`)
In Python, functions are defined using the `def` keyword:
```python
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
- `def`: Tells Python we are creating a function named `calculate_fees`.
- `(amount)`: The parameter (input) passed into the function.
- `return`: Sends the resulting dictionary back to whoever called the function.

### B. Dictionaries (`{}`)
Dictionaries store data in **key-value pairs**:
```python
user_data = {"name": "Alex Dev", "role": "FREELANCER"}
print(user_data["role"])  # Output: FREELANCER
```
- In our project, `session` is a dictionary, and fee calculations return dictionaries.

### C. Lists (`[]`)
Lists hold ordered collections of items:
```python
requirements = ["User Login", "Product Catalog", "Shopping Cart"]
```
- `request.form.getlist("requirements[]")` retrieves a list of all requirements submitted by the user.

### D. Decorators (`@app.route`, `@wraps`)
A decorator is a function that wraps another function to give it extra behavior:
```python
@app.route("/client-dashboard")
@login_required("CLIENT")
def client_dashboard():
    ...
```
- `@app.route(...)`: Tells Flask to run `client_dashboard()` when a user visits that URL.
- `@login_required("CLIENT")`: Checks if the user is logged in as a Client before allowing access. If not, it redirects them to login.

### E. Error Handling (`try` and `except`)
Used in `ai.py` and `send_acceptance_email()` to prevent the website from crashing if an external API is offline:
```python
try:
    # Try calling external service
    response = client.models.generate_content(...)
except Exception as e:
    # If it fails, fall back to safe local logic
    print("Fallback activated:", e)
```

---

## 3. Libraries Used in Our Python Code

| Library | Where It Is Used | Purpose |
| :--- | :--- | :--- |
| `flask` | `app.py` | Web framework that handles HTTP routing, requests, and HTML rendering. |
| `sqlite3` | `app.py` | Built-in Python library for connecting to and querying our database. |
| `os` | `app.py`, `ai.py` | Accesses system environment variables and file paths. |
| `uuid` | `app.py` | Generates random unique invoice codes like `INV-2026-AB12`. |
| `datetime` | `app.py` | Handles timestamps for project deadlines and invoices. |
| `smtplib` | `app.py` | Built-in library to send emails via Gmail SMTP server. |
| `requests` | `app.py` | Makes HTTP calls to Google's OAuth endpoints. |
| `google.genai` | `ai.py` | Official SDK to send prompts to Google Gemini AI. |

---

## 4. Top Python Viva Questions

**Q1: Why did we consolidate the project into only two Python files (`app.py` and `ai.py`)?**  
> *"To avoid unnecessary file fragmentation and over-engineering. In an academic project, having all web, database, and escrow logic in `app.py` and AI logic in `ai.py` makes the entire application easy to trace, study, and explain."*

**Q2: What is the difference between `==` and `=` in Python?**  
> *"`=` is assignment (stores a value in a variable, e.g. `x = 10`), while `==` is comparison (checks if two values are equal, e.g. `if role == 'CLIENT':`)."*

**Q3: How does Python manage SQLite connections using `g`?**  
> *"Flask's `g` object stores data for the duration of a single HTTP request. We store the database connection in `g.db` so multiple queries during one request can reuse the same connection, and `close_db()` automatically closes it when the request completes."*
