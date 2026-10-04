# Learning Guide: ai.py (Gemini AI Integration)

---

## A. PURPOSE
`ai.py` is the **dedicated AI module** of FreelanceGuard.
- It connects to Google Gemini using the `google-genai` SDK.
- It converts unstructured client project descriptions into structured, numbered requirements and suggested milestone deliverable phases with budget breakdowns.
- **Critical Architectural Boundary**: AI is strictly limited to text structuring. Gemini NEVER approves milestones, NEVER releases escrow, NEVER calculates fees, and NEVER resolves disputes.

---

## B. CONNECTIONS
- **Files that use `ai.py`**:
  - `app.py`: Calls `extract_requirements_and_milestones(...)` when the client clicks the *"Analyze Requirements with AI"* button via the `/api/analyze-requirements` route.
- **Files that `ai.py` uses**:
  - `.env`: Reads `GEMINI_API_KEY`.

---

## C. IMPORTANT VARIABLES
- `GEMINI_API_KEY`: The API key retrieved from Google AI Studio.
- `prompt`: The engineering prompt guiding Gemini to output valid, parseable JSON containing `requirements` and `milestones`.
- `data`: The parsed Python dictionary containing the extracted lists.

---

## D. FUNCTIONS

### 1. `extract_requirements_and_milestones(title, description, budget)`
- **Input**:
  - `title` (string): Project name.
  - `description` (string): Raw client description.
  - `budget` (float): Total project budget.
- **What it does**:
  1. Checks if `GEMINI_API_KEY` exists. If missing or if network fails, falls back gracefully to `generate_fallback_analysis()`.
  2. Constructs the prompt demanding JSON output with sequential milestones whose budgets add up to the total budget.
  3. Sends request to `gemini-2.5-flash` using `client.models.generate_content`.
  4. Strips markdown fences (```json) and parses with `json.loads()`.
- **Output**: Dictionary with `{"success": True, "requirements": [...], "milestones": [...]}`.

### 2. `generate_fallback_analysis(title, description, budget)`
- **Input**: `title`, `description`, `budget`.
- **What it does**: Parses lines locally using Python text heuristics and splits the budget into 3 standard milestones (30%, 40%, 30%).
- **Output**: Returns structured dictionary without requiring internet or API credentials.

---

## E. IMPORTANT CODE EXPLAINED LINE-BY-LINE

```python
# Create Gemini Client with API Key
client = genai.Client(api_key=GEMINI_API_KEY)

# Call Gemini 2.5 Flash model
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
)

# Clean markdown formatting and parse into Python dictionary
clean_text = re.sub(r"^```(json)?\n", "", response.text.strip(), flags=re.MULTILINE)
clean_text = re.sub(r"```$", "", clean_text, flags=re.MULTILINE).strip()
data = json.loads(clean_text)
```

- `genai.Client(...)`: Initializes Google's official Gemini client.
- `gemini-2.5-flash`: High-speed multimodal LLM optimal for fast text extraction.
- `re.sub(...)`: Regular expression that removes markdown code blocks (` ```json `) so `json.loads` doesn't crash.

---

## F. WHY WE USED IT IN FREELANCEGUARD
Clients frequently write vague or disorganized project descriptions. Gemini structures this raw text into distinct, verifiable deliverables and milestone steps. This gives the freelancer clear expectations before accepting, reducing misunderstandings.

---

## G. LIKELY VIVA QUESTIONS & ANSWERS

**Q1: What role does Gemini AI play in this application?**  
> *"Gemini is used strictly for AI-assisted requirement extraction and milestone structuring. It helps the client break down an idea into concrete deliverables."*

**Q2: Can Gemini approve a milestone or release payment?**  
> *"No, sir/ma'am. By design, Gemini has zero authority over escrow, approvals, payments, or disputes. Financial control remains 100% with the client, freelancer, and platform administrator."*

**Q3: What happens if the college internet is down or the Gemini API quota is exceeded?**  
> *"The function catches exceptions in a `try...except` block and automatically falls back to an intelligent local parser (`generate_fallback_analysis`), allowing the demo to proceed without crashing."*
