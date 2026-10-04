# Learning Guide: Templates (HTML & Jinja2)

---

## A. PURPOSE
The files in the `templates/` directory define the user interface of FreelanceGuard:
- `base.html`: The master template containing the layout, navigation bar, top academic simulation banner, flash alert container, and footer.
- `index.html`: The role selection landing page asking: *"How do you want to continue? Client or Freelancer"*.
- `login.html`: The Google login screen showing the role-specific login prompt.

---

## B. CONNECTIONS
- **Files that use templates**:
  - `app.py` renders them using `render_template("page.html", ...)`.
- **Files that templates use**:
  - `static/css/style.css`: Provides design tokens, layout styling, card aesthetics, and animations.
  - `static/js/app.js`: Minimal client-side JavaScript for notifications.

---

## C. IMPORTANT CONCEPTS & SYNTAX

### 1. Jinja2 Template Inheritance
Instead of copying the navigation bar and footer on every single page, we use **template inheritance**:
- In `base.html`:
  ```html
  {% block content %}
  {% endblock %}
  ```
- In child templates like `index.html`:
  ```jinja
  {% extends "base.html" %}

  {% block content %}
    <!-- Unique page content here -->
  {% endblock %}
  ```
*Viva explanation*: `extends` imports the master frame from `base.html`, and `block content` replaces only the middle container with the child page's unique HTML.

### 2. Expression Interpolation `{{ ... }}`
In Jinja2, double curly braces print Python variables into the HTML output.
Example: `{{ role }}` displays the string `"CLIENT"` or `"FREELANCER"`.

### 3. Logic Tags `{% ... %}`
Curly-brace-percent tags perform logic in templates:
```jinja
{% if session.get('user_id') %}
  <a href="/logout">Logout</a>
{% else %}
  <a href="/">Get Started</a>
{% endif %}
```

---

## D. IMPORTANT UI ELEMENTS IN OUR PROJECT

### 1. Academic Simulation Banner
```html
<div class="academic-banner">
  <span class="pulse-dot"></span>
  <span>Simulated Escrow — Academic Demonstration (No Real Money Is Transferred)</span>
</div>
```
- **Why this exists**: It satisfies the core project requirement: making it explicitly clear to college examiners that this is an academic simulation with no real payment gateway or real financial risk.

### 2. Flash Message Alert System
```jinja
{% with messages = get_flashed_messages(with_categories=true) %}
  {% if messages %}
    <div class="flash-container">
      {% for category, message in messages %}
        <div class="alert alert-{{ category }}">{{ message }}</div>
      {% endfor %}
    </div>
  {% endif %}
{% endwith %}
```
- When Flask calls `flash("Project accepted!", "success")`, Jinja renders a green success alert automatically.

---

## E. LIKELY VIVA QUESTIONS & ANSWERS

**Q1: What is Jinja2?**  
*Answer*: Jinja2 is Flask's built-in templating engine. It lets us write standard HTML and insert dynamic data, conditional if/else blocks, and loops from Python.

**Q2: What is the benefit of `{% extends "base.html" %}`?**  
*Answer*: It avoids repetitive code (DRY principle - Don't Repeat Yourself). The header, navigation, CSS stylesheet, and footer are written once in `base.html` and reused on all pages.

**Q3: How does client/freelancer navigation change dynamically?**  
*Answer*: By checking `session.get('user_role')` inside `base.html`. If the role is `CLIENT`, it renders the Client Dashboard link; if `FREELANCER`, it renders the Freelancer Dashboard link.
