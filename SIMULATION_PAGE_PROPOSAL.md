# Simulation Page Structure — UX/UI Improvement Proposal

## Current Issues

### 1. **Missing Navigation Context**
- No breadcrumbs — users lose track of where they are
- No clear path back to category overview

### 2. **Poor Information Hierarchy**
- Attack vector (subline) appears before test context
- Instructions split from simulation in two-column layout creates cognitive disconnect
- Feedback section orphaned outside layout structure
- Best practices buried at bottom after sibling cards

### 3. **Unclear Test Flow**
- No numbered steps
- Instructions don't clearly map to actions
- Verification gate appears without context
- No visual progress indicators

### 4. **Layout Problems**
- Two-column split (instructions | simulation) doesn't serve UX
  - Forces horizontal eye movement
  - Instructions are static reference, simulation is interactive
  - Unequal cognitive weight
- Sibling level cards take visual priority over current test
- Feedback placement confusing (template puts it outside two-column div)

### 5. **Content Organization**
- Everything crammed into hero section
- No clear sections with breathing room
- Visual hierarchy flat

---

## Proposed Structure

### **Template Flow**

```
┌─────────────────────────────────────────────────────┐
│ Header (global navigation)                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Breadcrumbs                                          │
│ Home → Phishing → Level 1: Known phishing           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Page Header                                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Badge: Beginner     Duration: ~2 min            │ │
│ │ Headline: Phishing – Level 1: Known phishing    │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Section 1: What You're Testing                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🎯 Test Objective                               │ │
│ │ Validate URL reputation filtering against       │ │
│ │ known phishing domains.                         │ │
│ │                                                  │ │
│ │ ⚡ Attack Vector                                 │ │
│ │ Phishing emails contain links to known          │ │
│ │ malicious domains already cataloged by          │ │
│ │ threat intelligence feeds.                      │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Section 2: How to Run This Test                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Step 1: Configure your SWG                      │ │
│ │ Whitelist swgaudit.com to allow access to this  │ │
│ │ page. Your SWG should inspect and block the     │ │
│ │ test URL below.                                 │ │
│ │                                                  │ │
│ │ Step 2: Verify your identity                    │ │
│ │ Submit your business email to unlock the        │ │
│ │ simulation.                                     │ │
│ │                                                  │ │
│ │ Step 3: Run the test                            │ │
│ │ Click the test URL. If your SWG blocks it,      │ │
│ │ you pass. If it loads, your SWG failed.         │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Section 3: Run Simulation                           │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Verification Gate OR Simulation Content]       │ │
│ │                                                  │ │
│ │ Gate:                                           │ │
│ │ - Email input                                   │ │
│ │ - reCAPTCHA                                     │ │
│ │ - Submit button                                 │ │
│ │                                                  │ │
│ │ OR                                              │ │
│ │                                                  │ │
│ │ Content:                                        │ │
│ │ - Test URL (copy button)                       │ │
│ │ - Click to test button                         │ │
│ │ - Result banner (PASS/FAIL)                    │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Section 4: Best Practice Recommendations            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🛡️ Best Practice Recommendations                │ │
│ │ - Policy configuration                          │ │
│ │ - Feed selection                                │ │
│ │ - Update frequency                              │ │
│ │ - Validation                                    │ │
│ │ - Defense in depth                              │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Section 5: Continue Testing                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Other Phishing Levels:                          │ │
│ │ [Level 2 Card] [Level 3 Card]                   │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Level Navigation (sticky bottom)                    │
│ [← Prev] [Return to Phishing] [Next →]             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Footer                                               │
└─────────────────────────────────────────────────────┘
```

---

## Key UX Improvements

### 1. **Clear Information Hierarchy**
- **Context first**: Breadcrumbs → Metadata → Objective
- **Instructions before action**: Step-by-step guide before simulation
- **Results inline**: Feedback appears in simulation area
- **Related content last**: Sibling levels after primary task

### 2. **Visual Flow**
- Single-column layout for clear top-to-bottom reading
- Sections clearly delineated with spacing and containers
- Progressive disclosure: instructions → action → results

### 3. **Numbered Steps**
- Clear 1-2-3 sequence
- Each step explains what and why
- Reduces cognitive load

### 4. **Sectioned Layout**
- Each section has a clear purpose
- Visual breathing room between sections
- Easier to scan and reference

### 5. **Metadata Prominence**
- Level difficulty badge
- Estimated duration
- Both visible at top (not buried in cards)

### 6. **Better Result Placement**
- Feedback appears inside simulation area
- Contextually adjacent to test action
- No orphaned content

---

## Content Changes

### Remove
- ❌ Generic "Simulation instructions" heading (replace with "How to Run This Test")
- ❌ Two-column layout split
- ❌ Feedback section outside simulation box
- ❌ Subline as plain paragraph (move to structured objective section)

### Add
- ✅ Breadcrumb navigation
- ✅ Metadata badges (difficulty, duration) at top
- ✅ "What You're Testing" section with objective + attack vector
- ✅ Numbered steps in "How to Run This Test"
- ✅ "Continue Testing" section header for sibling cards
- ✅ Visual section dividers

### Improve
- Better headings (objective-oriented, not generic)
- Icon usage (🎯 objective, ⚡ attack vector, 🛡️ best practices)
- Clearer CTA language
- Grouped related content

---

## CSS Additions Needed

```css
/* Breadcrumb navigation */
.breadcrumb-nav {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}

/* Page metadata (badges at top) */
.page-meta {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  margin-bottom: var(--space-2);
}

/* Test objective section */
.test-objective-section {
  background: var(--color-bg-banner);
  border-left: 4px solid var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius);
  margin-bottom: var(--space-5);
}

.test-objective-item {
  margin-bottom: var(--space-3);
}

.test-objective-item:last-child {
  margin-bottom: 0;
}

.test-objective-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--weight-semibold);
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

/* Instruction steps */
.instruction-steps {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: var(--space-4);
  border-radius: var(--radius);
  margin-bottom: var(--space-5);
}

.instruction-step {
  margin-bottom: var(--space-3);
  padding-left: var(--space-4);
  position: relative;
}

.instruction-step:last-child {
  margin-bottom: 0;
}

.instruction-step::before {
  content: attr(data-step);
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-primary);
  color: var(--color-button-text);
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: var(--weight-semibold);
}

.instruction-step-title {
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-1);
}

/* Simulation section wrapper */
.simulation-section {
  margin-bottom: var(--space-5);
}

.simulation-section-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-3);
}

/* Continue testing section */
.continue-testing-section {
  margin-bottom: var(--space-5);
}

.continue-testing-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  text-align: center;
  margin-bottom: var(--space-4);
}
```

---

## Implementation Priority

### Phase 1: Structure (High Impact)
1. Add breadcrumbs
2. Add metadata badges at top
3. Create "What You're Testing" section
4. Convert instructions to numbered steps
5. Remove two-column layout
6. Make simulation full-width
7. Move best practices before sibling cards

### Phase 2: Polish (Medium Impact)
1. Add section titles
2. Add icons to sections
3. Improve spacing between sections
4. Style numbered steps
5. Add visual dividers

### Phase 3: Enhancement (Lower Priority)
1. Add progress indicator
2. Add "Back to top" link
3. Add print-friendly view
4. Add social share buttons

---

## Benefits

### For Users
- ✅ Clearer task flow (what → how → do → learn)
- ✅ Faster comprehension (no horizontal scanning)
- ✅ Better orientation (breadcrumbs + metadata)
- ✅ Easier to follow (numbered steps)
- ✅ Less cognitive load (sectioned content)

### For Business
- ✅ Higher completion rates (clearer instructions)
- ✅ Better engagement (organized content)
- ✅ Reduced support questions (self-evident flow)
- ✅ More professional presentation (structured layout)

---

## Next Steps

1. Review and approve this proposal
2. Update template HTML structure
3. Add new CSS classes
4. Update build script if needed
5. Test on phishing level 1
6. Roll out to other simulation pages
