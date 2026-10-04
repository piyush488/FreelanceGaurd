# JavaScript Programming Guide for Viva (FreelanceGuard)

This guide covers **Vanilla JavaScript concepts, DOM methods, and asynchronous API calls** used in `static/js/app.js`.

---

## 1. Why Minimal Vanilla JavaScript?
- **No Heavy Frameworks**: No React, Vue, or Angular complexity.
- **Easy Viva Explanation**: We use standard browser-native JavaScript functions that examiners recognize immediately.
- **Specific Responsibilities**: JavaScript in FreelanceGuard is strictly limited to:
  1. Sending asynchronous requests to Gemini AI via `fetch()`.
  2. Dynamically adding and removing requirement rows and milestone cards.
  3. Automatically dismissing flash alerts after 5 seconds.

---

## 2. Core JavaScript Concepts in Our Code

### A. Waiting for the DOM: `DOMContentLoaded`
```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log("FreelanceGuard UI initialized.");
});
```
- Ensures all HTML tags are parsed and ready before our script attempts to find elements or attach click listeners.

### B. Finding Elements: `document.getElementById` & `document.querySelectorAll`
- `document.getElementById("btnAnalyzeAI")`: Finds the single element with that specific HTML `id`.
- `document.querySelectorAll(".alert")`: Finds all elements that have the CSS class `.alert`.

### C. Asynchronous Fetch (`async` / `await` and `fetch()`)
Used to call the Gemini AI analysis endpoint without reloading the page:
```javascript
const response = await fetch("/api/analyze-requirements", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: title,
    description: description,
    budget: budget
  })
});
const data = await response.json();
```
- `fetch()`: Sends an HTTP request to the Flask server in the background.
- `await`: Pauses execution until the server replies, keeping the code clean and synchronous-looking without nested callbacks.
- `JSON.stringify(...)`: Converts a JavaScript object into a JSON string to transmit over the network.
- `response.json()`: Parses the server's incoming JSON response back into a JavaScript object.

### D. Dynamic DOM Manipulation
When Gemini AI returns extracted requirements, JavaScript inserts them dynamically:
```javascript
const row = document.createElement("div");
row.className = "req-row";
row.innerHTML = `<input type="text" name="requirements[]" value="${text}">`;
container.appendChild(row);
```
- `createElement("div")`: Creates a new HTML element in memory.
- `appendChild(...)`: Attaches the new element to the page.
- `row.remove()`: Removes an element when its delete button is clicked.

---

## 3. Top JavaScript Viva Questions

**Q1: Why did you use `fetch()` instead of a standard HTML form submission for AI analysis?**  
> *"If we used a standard form submission, the page would reload and wipe out the client's form inputs. Using `fetch()` allows Gemini to analyze the text in the background and insert the structured milestones into the active form so the client can review and edit them before saving."*

**Q2: What is the difference between `const` and `let` in JavaScript?**  
> *"`const` declares a variable that cannot be reassigned (e.g. references to HTML buttons). `let` declares a variable whose value can change later."*

**Q3: What does `async` and `await` do?**  
> *"`async` marks a function as asynchronous, allowing the use of `await`. `await` pauses execution until a Promise (like a network HTTP request) resolves, avoiding messy callback chains."*
