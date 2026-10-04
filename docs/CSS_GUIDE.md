# CSS & Design System Guide for Viva (FreelanceGuard)

This guide explains **CSS variables, layout techniques, animations, and responsive rules** used in `static/css/style.css`.

---

## 1. Why Vanilla CSS Instead of Tailwind or Bootstrap?
- **No external build step**: Works immediately in all browsers without Node.js or npm compiler overhead.
- **Easy Viva Explanation**: Every line in `style.css` is standard CSS3. When an examiner points to an element, you can clearly explain the exact styling properties.
- **Performance**: Instant page rendering with zero bloat.

---

## 2. Key CSS Techniques in Our Project

### A. CSS Custom Properties (CSS Variables)
Defined inside the `:root` pseudo-class:
```css
:root {
  --primary: #4f46e5;    /* Vibrant Indigo */
  --success: #10b981;    /* Emerald Green for escrow and payouts */
  --warning: #f59e0b;    /* Amber for revisions */
  --danger: #ef4444;     /* Red for disputes */
  --bg-page: #f8fafc;    /* Clean page background */
  --bg-card: #ffffff;    /* Card background */
}
```
- Accessed anywhere using `var(--primary)`. If we want to change the primary brand color across the entire project, we change it in only one place!

### B. Flexbox (`display: flex`)
- Used for 1-dimensional layouts (navbars, button contents, alert rows):
```css
.navbar {
  display: flex;
  justify-content: space-between; /* Brand on left, links on right */
  align-items: center;            /* Perfectly centered vertically */
}
```

### C. CSS Grid (`display: grid`)
- Used for 2-dimensional layouts (dashboard metrics cards, role selection grid):
```css
.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
}
```
- `repeat(auto-fit, minmax(320px, 1fr))`: Automatically fits as many cards as can fit side-by-side on wide screens, and gracefully wraps to 1 column on mobile phones.

### D. CSS Micro-Animations (`@keyframes`)
1. **Pulse Animation**:
```css
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}
```
- Blinks the cyan dot beside the "Simulated Escrow" text to draw attention to the academic demonstration notice.

2. **Hover Lift Effect**:
```css
.role-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}
```
- Smoothly lifts cards 5 pixels upward when the mouse hovers over them, giving an interactive, tactile feel.

---

## 3. Top CSS Viva Questions

**Q1: What are CSS variables and what advantage do they provide?**  
> *"CSS variables store reusable styling values in `:root`. They ensure visual consistency across all pages and allow us to update theme colors globally in a single line of code."*

**Q2: How is responsiveness handled without external libraries like Bootstrap?**  
> *"Through CSS Flexbox, responsive CSS Grid with `auto-fit`, and media queries like `@media (max-width: 768px)` that switch multi-column layouts into single-column stacks on smaller screens."*

**Q3: How do the card hover animations work?**  
> *"By combining `transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);` with `transform: translateY(-5px);` on the `:hover` pseudo-class."*
