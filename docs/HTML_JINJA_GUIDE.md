# HTML & Jinja2 Templating Guide for Viva (FreelanceGuard)

This guide explains **HTML structure, forms, and Flask's Jinja2 templating engine** used across all `.html` files in the `templates/` folder.

---

## 1. What is Jinja2 and How Does It Connect with Flask?
- **Jinja2** is the template engine built into Flask.
- When Flask calls `render_template("client_dashboard.html", projects=projects)`, Jinja takes the raw HTML template, replaces dynamic placeholders with real Python data, and sends the final pure HTML to the user's browser.

---

## 2. Core Jinja2 Syntax in Our Templates

### A. Expressions: `{{ variable }}`
- Used to print Python variables directly into HTML:
```html
<h1>Welcome, {{ current_user.name }}</h1>
<div class="budget">₹{{ "{:,.2f}".format(project.budget) }}</div>
```
- `"{:,.2f}".format(...)` is standard Python formatting that adds commas and two decimal places (e.g. `5,000.00`).

### B. Template Inheritance: `{% extends %}` and `{% block %}`
- Prevents duplicating the navigation bar, CSS links, and footer on every page.
- In `base.html`:
```html
<nav class="navbar">...</nav>
<div class="container">
  {% block content %}{% endblock %}
</div>
<footer class="footer">...</footer>
```
- In child templates (e.g. `index.html`):
```jinja
{% extends "base.html" %}

{% block content %}
  <!-- Only unique page elements here -->
{% endblock %}
```

### C. Conditionals: `{% if ... %} ... {% endif %}`
- Renders HTML conditionally based on the user's state:
```jinja
{% if project.status == 'OPEN' %}
  <span class="badge badge-open">OPEN</span>
{% elif project.status == 'ACCEPTED' %}
  <span class="badge badge-accepted">ACCEPTED</span>
{% endif %}
```

### D. Loops: `{% for ... %} ... {% endfor %}`
- Iterates over lists passed from Flask:
```jinja
{% for m in milestones %}
  <div class="milestone-card">
    <h4>{{ m.title }}</h4>
    <p>Amount: ₹{{ m.amount }}</p>
  </div>
{% endfor %}
```

---

## 3. HTML Forms and HTTP Methods

### A. The `<form>` Tag
- Submits data to Flask routes:
```html
<form action="{{ url_for('create_project') }}" method="POST">
  <input type="text" name="title" required>
  <button type="submit">Submit Project</button>
</form>
```
- `action`: The URL that receives the form data (generated using `url_for(...)`).
- `method="POST"`: Sends data securely in the HTTP request body instead of visible URL query parameters.
- `name="title"`: The key that Flask accesses via `request.form.get("title")`.

---

## 4. Top HTML & Jinja2 Viva Questions

**Q1: What is the difference between GET and POST requests in HTML forms?**  
> *"GET requests retrieve data and append form values into the URL query string (useful for search filters). POST requests transmit submitted data securely inside the HTTP request body, which is required for creating projects, funding escrow, and approving milestones."*

**Q2: What is the purpose of `url_for('static', filename='css/style.css')`?**  
> *"It dynamically generates the correct absolute URL path to static assets (like CSS stylesheets and JavaScript files), ensuring links never break regardless of how routes are nested."*

**Q3: How does the application display flash messages across page redirects?**  
> *"Flask stores flash messages temporarily in the session cookie. In `base.html`, `get_flashed_messages(with_categories=true)` reads those messages and renders them as styled alert banners on the subsequent page load."*
