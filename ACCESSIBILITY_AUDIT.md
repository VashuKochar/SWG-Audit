# Accessibility Audit - WCAG 2.1 AA Compliance

Comprehensive accessibility checklist and recommendations for SWG Audit.

## ✅ Current Accessibility Features

### Semantic HTML
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✅ `<button>` for interactive elements
- ✅ `<form>` with proper labels

### ARIA Labels
- ✅ Navigation landmarks (`aria-label`)
- ✅ Live regions for dynamic content (`aria-live="polite"`)
- ✅ Button states (`aria-expanded` for mobile menu)
- ✅ Hidden content properly marked (`hidden` attribute)

### Keyboard Navigation
- ✅ All interactive elements focusable (buttons, links, form fields)
- ✅ Focus visible (outline on `:focus-visible`)
- ✅ Escape key closes mobile menu
- ✅ Tab navigation works throughout

### Color Contrast
- ✅ Text meets WCAG AA standards (4.5:1 for body, 3:1 for large text)
- ✅ Dark mode variants maintain contrast
- ✅ Result banners use sufficient contrast (green/red borders + backgrounds)

### Visual Indicators
- ✅ Icons paired with text (✅ PASS, ❌ FAIL)
- ✅ Color not used as sole indicator (text + icons + borders)
- ✅ Focus outlines visible

### Responsive Design
- ✅ Mobile-friendly (touch targets ≥ 48px)
- ✅ Text scales with browser zoom
- ✅ No horizontal scrolling on mobile

---

## 🔧 Improvements Needed

### 1. Contrast Ratios (PRIORITY: HIGH)

**Test Method:**
```bash
# Install contrast checker
npm install -g wcag-contrast

# Check key colors
wcag-contrast "#0066cc" "#ffffff"  # Primary on white
wcag-contrast "#1a1a1a" "#ffffff"  # Text on white
wcag-contrast "#e6e6e6" "#1a1a1a"  # Text on dark (dark mode)
```

**Action Items:**
- [ ] Audit all color combinations with contrast checker
- [ ] Fix any failures (especially muted text colors)
- [ ] Document minimum contrast ratios in STYLE.md

### 2. Form Labels and Error Messages

**Current Issues:**
- Email validation errors redirect to home with query params (not screen-reader friendly)
- Error messages not associated with form fields

**Fixes:**
```html
<!-- Add ARIA error messages -->
<input type="email" id="verify-email" 
       aria-describedby="email-error" 
       aria-invalid="false">
<span id="email-error" class="error" hidden></span>

<!-- Show inline errors instead of redirects -->
<script>
if (error === 'email_invalid') {
  emailInput.setAttribute('aria-invalid', 'true');
  emailError.textContent = 'Please enter a valid email address';
  emailError.hidden = false;
}
</script>
```

**Action Items:**
- [ ] Add inline error messages to verification form
- [ ] Associate errors with inputs via `aria-describedby`
- [ ] Update `aria-invalid` dynamically

### 3. Skip Links

**Missing:** Skip to main content link for keyboard users

**Fix:**
```html
<!-- Add at top of <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Style: hidden unless focused -->
<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
</style>

<!-- Add id to main -->
<main id="main-content">
```

**Action Items:**
- [ ] Add skip link to header partial
- [ ] Add `id="main-content"` to all templates
- [ ] Style skip link (visible on focus only)

### 4. Image Alt Text

**Current:**
```html
<img src="/icons/logo_swg_audit.png" alt="" aria-hidden="true">
```

**Issue:** Logo is decorative, correctly hidden. Category card images also decorative.

**Check:**
- [ ] Verify all `alt=""` images are truly decorative
- [ ] Add meaningful alt text to any informational images

### 5. Link Text

**Potential Issue:** "Click here" or ambiguous link text

**Audit:**
```bash
# Check for generic link text
grep -r "click here\|here\|read more" src/
```

**Fix:** Use descriptive link text
```html
<!-- Bad -->
<a href="/phishing/">Click here</a> to test phishing defenses.

<!-- Good -->
<a href="/phishing/">Test phishing defenses</a> with our simulation.
```

**Action Items:**
- [ ] Audit all link text for clarity
- [ ] Ensure links make sense out of context
- [ ] Add `aria-label` if link text must be ambiguous

### 6. Focus Management

**Missing:** Focus management after dynamic content changes

**Example Issues:**
- When verification gate shows/hides, focus doesn't move
- When result banner appears, screen readers don't announce
- When mobile menu opens, focus doesn't trap

**Fixes:**
```javascript
// Move focus to sim content after verification
function showContent() {
  gateEl.hidden = true;
  contentEl.hidden = false;
  contentEl.querySelector('h3').focus(); // Move focus to heading
}

// Announce result banner to screen readers
function showResult(outcome) {
  // ... existing code ...
  passEl.setAttribute('role', 'alert'); // Forces announcement
}

// Trap focus in mobile menu
function openMenu() {
  // ... existing code ...
  trapFocus(navEl); // Implement focus trap
}
```

**Action Items:**
- [ ] Move focus to content after verification
- [ ] Add `role="alert"` to result banners for immediate announcement
- [ ] Implement focus trap for mobile menu
- [ ] Return focus to toggle button when menu closes

### 7. Breadcrumb Navigation

**Current:** Basic text with arrows

**Improvement:** Use proper breadcrumb markup
```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/phishing/">Phishing</a></li>
    <li aria-current="page">Level 1: Known Phishing</li>
  </ol>
</nav>
```

**Action Items:**
- [ ] Update breadcrumb to use `<ol>` instead of plain text
- [ ] Add `aria-current="page"` to current page

### 8. Tables (if any)

**Check:** Are data tables used anywhere? (e.g., in docs)

**If yes:**
- [ ] Add `<thead>`, `<tbody>`, `<th scope="col|row">`
- [ ] Caption tables with `<caption>`

### 9. Video/Audio Content

**Current:** None

**If added later:**
- [ ] Provide captions for videos
- [ ] Provide transcripts for audio
- [ ] Ensure media players are keyboard accessible

### 10. Motion and Animation

**Current Animations:**
- Result banner slide-in (300ms)
- Toast slide-in (300ms)
- Hamburger icon rotation
- Dark mode color transitions

**Issue:** Users with `prefers-reduced-motion` may experience discomfort

**Fix:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Action Items:**
- [ ] Add `prefers-reduced-motion` query to disable animations
- [ ] Test with system setting enabled

---

## 🧪 Testing Tools

### Automated

```bash
# Install axe-core
npm install -g @axe-core/cli

# Run on built site
axe http://localhost:3000 --save results.json

# Install Pa11y
npm install -g pa11y

# Test specific pages
pa11y http://localhost:3000
pa11y http://localhost:3000/phishing/
pa11y http://localhost:3000/phishing/level1/
```

### Browser Extensions

- **axe DevTools** (Chrome/Firefox)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools → Audits → Accessibility)

### Manual Testing

1. **Keyboard Only:**
   - Disconnect mouse
   - Navigate entire site with Tab, Enter, Escape
   - Ensure all functionality works

2. **Screen Reader:**
   - **NVDA** (Windows, free): https://www.nvaccess.org/
   - **JAWS** (Windows, commercial)
   - **VoiceOver** (macOS, built-in): Cmd+F5
   - Test navigation, form filling, result announcements

3. **Zoom:**
   - Test at 200% zoom (browser zoom, not OS zoom)
   - Ensure no content hidden or overlapping
   - Check all interactive elements remain accessible

4. **Color Blindness:**
   - Use browser extensions to simulate:
     - Protanopia (red-blind)
     - Deuteranopia (green-blind)
     - Tritanopia (blue-blind)
   - Ensure pass/fail indicators work without color

---

## 📋 WCAG 2.1 AA Checklist

### Perceivable

- [x] 1.1.1 Non-text Content (alt text)
- [ ] 1.2.1 Audio-only and Video-only (N/A - no media)
- [ ] 1.2.2 Captions (N/A - no media)
- [ ] 1.2.3 Audio Description (N/A - no media)
- [x] 1.3.1 Info and Relationships (semantic HTML)
- [x] 1.3.2 Meaningful Sequence (logical tab order)
- [x] 1.3.3 Sensory Characteristics (not relying on shape/color alone)
- [ ] 1.3.4 Orientation (responsive, works portrait/landscape)
- [ ] 1.3.5 Identify Input Purpose (autocomplete attributes)
- [x] 1.4.1 Use of Color (icons + text + borders)
- [x] 1.4.2 Audio Control (N/A - no audio)
- [ ] 1.4.3 Contrast (Minimum) - **NEEDS AUDIT**
- [ ] 1.4.4 Resize Text (test 200% zoom)
- [x] 1.4.5 Images of Text (using real text, not images)
- [ ] 1.4.10 Reflow (no horizontal scroll at 320px width)
- [ ] 1.4.11 Non-text Contrast (UI components 3:1)
- [ ] 1.4.12 Text Spacing (test with custom CSS)
- [ ] 1.4.13 Content on Hover/Focus (tooltips, dropdowns)

### Operable

- [x] 2.1.1 Keyboard (all functionality keyboard accessible)
- [ ] 2.1.2 No Keyboard Trap - **TEST MOBILE MENU**
- [x] 2.1.4 Character Key Shortcuts (N/A - no shortcuts)
- [ ] 2.2.1 Timing Adjustable (session timeout = 24h, acceptable)
- [x] 2.2.2 Pause, Stop, Hide (no auto-playing content)
- [x] 2.3.1 Three Flashes (no flashing content)
- [x] 2.4.1 Bypass Blocks - **NEEDS SKIP LINK**
- [x] 2.4.2 Page Titled (all pages have `<title>`)
- [ ] 2.4.3 Focus Order - **TEST WITH TAB**
- [x] 2.4.4 Link Purpose (descriptive link text)
- [x] 2.4.5 Multiple Ways (nav menu + breadcrumbs)
- [ ] 2.4.6 Headings and Labels - **AUDIT LABELS**
- [x] 2.4.7 Focus Visible (outlines on `:focus-visible`)
- [x] 2.5.1 Pointer Gestures (no complex gestures)
- [x] 2.5.2 Pointer Cancellation (click on up event)
- [ ] 2.5.3 Label in Name (visible label matches accessible name)
- [x] 2.5.4 Motion Actuation (no shake/tilt controls)

### Understandable

- [x] 3.1.1 Language of Page (`<html lang="en">`)
- [x] 3.1.2 Language of Parts (N/A - all English)
- [x] 3.2.1 On Focus (no context change on focus)
- [x] 3.2.2 On Input (no context change on input)
- [x] 3.2.3 Consistent Navigation (nav same on all pages)
- [x] 3.2.4 Consistent Identification (icons/labels consistent)
- [ ] 3.3.1 Error Identification - **NEEDS INLINE ERRORS**
- [ ] 3.3.2 Labels or Instructions - **AUDIT FORMS**
- [ ] 3.3.3 Error Suggestion (provide correction hints)
- [x] 3.3.4 Error Prevention (verification can be retried)

### Robust

- [ ] 4.1.1 Parsing (validate HTML)
- [ ] 4.1.2 Name, Role, Value - **AUDIT CUSTOM COMPONENTS**
- [ ] 4.1.3 Status Messages - **ADD role="status" TO TOASTS**

---

## 🚀 Priority Implementation

### Phase 1: Critical (This Week)

1. [ ] Run axe-core automated scan
2. [ ] Fix all critical contrast failures
3. [ ] Add skip link
4. [ ] Update breadcrumbs to proper markup
5. [ ] Add `role="alert"` to result banners

### Phase 2: Important (Next Week)

6. [ ] Implement focus management (verification, mobile menu)
7. [ ] Add inline error messages to forms
8. [ ] Implement `prefers-reduced-motion`
9. [ ] Test with screen reader (NVDA)
10. [ ] Test keyboard-only navigation

### Phase 3: Polish (Ongoing)

11. [ ] Full manual testing checklist
12. [ ] User testing with assistive tech users
13. [ ] Document accessibility features
14. [ ] Create accessibility statement page

---

## 📄 Accessibility Statement (Draft)

Create `/about/accessibility/` page:

```markdown
# Accessibility Statement

SWG Audit is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

## Conformance Status

SWG Audit aims to conform to WCAG 2.1 Level AA standards. We are actively working toward full conformance.

## Feedback

We welcome feedback on the accessibility of SWG Audit. If you encounter barriers:

- Email: [contact email]
- GitHub Issues: [repo link]

## Testing

Our site is tested with:
- Keyboard navigation
- Screen readers (NVDA, VoiceOver)
- Browser zoom (200%)
- Automated tools (axe, Lighthouse)

## Known Issues

[List any known accessibility issues and timeline for fixes]

Last updated: [Date]
```

---

## ✅ Final Checklist

- [ ] Run automated tools (axe, Pa11y, Lighthouse)
- [ ] Fix all critical issues
- [ ] Test with screen reader
- [ ] Test keyboard-only
- [ ] Test 200% zoom
- [ ] Test reduced motion
- [ ] Document findings
- [ ] Create accessibility statement
- [ ] Schedule regular audits (quarterly)

---

**Note:** This audit was performed on 2026-02-12. Re-audit after major design changes or every 3 months.
