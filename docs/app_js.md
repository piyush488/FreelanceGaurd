# Learning Guide: static/js/app.js

---

## A. PURPOSE
`static/js/app.js` is the **client-side script** for FreelanceGuard.
Its duties are strictly confined to:
1. Sending asynchronous HTTP POST requests to Google Gemini AI via `/api/analyze-requirements` using `fetch()`.
2. Dynamically rendering extracted requirement rows and milestone breakdown cards without page reload.
3. Automatically fading out flash notification banners after 5 seconds.

---

## B. CONNECTIONS
- **Files that use `app.js`**:
  - `templates/base.html` includes `<script src="{{ url_for('static', filename='js/app.js') }}"></script>` at the bottom of the body.
- **Files that `app.js` connects to**:
  - `templates/create_project.html`: Binds click event to `btnAnalyzeAI`, and adds/removes requirement and milestone DOM rows.
  - `app.py`: Hits the `/api/analyze-requirements` route via `fetch()`.

---

## C. IMPORTANT VARIABLES
- `btnAnalyzeAI`: The DOM element for the "✨ Analyze Requirements with AI" button.
- `reqContainer`: The DOM container (`#requirementsContainer`) where requirement input rows are appended.
- `milestoneContainer`: The DOM container (`#milestonesContainer`) where milestone input cards are appended.

---

## D. IMPORTANT FUNCTIONS

### 1. `btnAnalyzeAI.addEventListener("click", async () => { ... })`
- **What it does**: Reads the project title, description, and budget from form inputs, displays a loading state on the button (`⏳ Gemini is analyzing...`), sends the data via `fetch()` to `/api/analyze-requirements`, and dynamically renders the returned lists.

### 2. `addRequirementRow(value)`
- **Input**: Text of a requirement deliverable.
- **What it does**: Creates a new `<div class="req-row">` with an `<input>` and a delete button (`&times;`), and appends it to `#requirementsContainer`.

### 3. `addMilestoneRow(title, amount, deadline, desc)`
- **Input**: Milestone title, amount in INR, target deadline, and description.
- **What it does**: Creates a milestone card with title, amount, deadline, and description inputs, and binds a removal listener.

---

## E. TOP VIVA QUESTIONS & ANSWERS

**Q1: Why did you use Vanilla JavaScript instead of React, Vue, or jQuery?**  
> *"Vanilla JavaScript requires no build tools, no Node.js compilation, and has zero external dependencies. It keeps our frontend lightweight and directly understandable for code review."*

**Q2: What is the purpose of `escapeHtml(text)` in `app.js`?**  
> *"It prevents Cross-Site Scripting (XSS) attacks by converting special characters like `<`, `>`, and `&` into their safe HTML entity representations before injecting AI-generated text into the DOM."*
