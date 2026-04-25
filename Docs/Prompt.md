{/* ============================================================
    PROMPT: Mental Models & Decision Systems Analysis
    Usage: replace the value of PERSON below, then run.
    ============================================================ */}

PERSON = [insert name]

---

## STEP 1: RESEARCH

Web search PERSON. Pull primary sources — their own writing, interviews, documented decisions, failures.
Ignore Wikipedia summaries, motivational bios, secondhand accounts.
Extract: how they actually reasoned, what they optimized for, where they failed.

---

## CONSTRAINTS

- No biography, no life events, no dates in output
- No motivational tone
- Write at 8th-grade reading level. No academic vocabulary.
- Frameworks must be operationalizable — reader can run a real decision through them
- Mechanisms must explain WHY the model works, not just label it
- Skip anything findable in first Google result — prioritize second-order effects and non-obvious failure cases
- `/humanizer` applies exclusively to `Example` fields — nowhere else
- Output as MDX document. No JSX components unless diagrams require it.
- All diagrams use this exact tag:

```
<pre style="background: transparent; border: none; overflow-x: auto; font-family: monospace; color: var(--text-muted); font-size: 0.85em;">
```

---

## OUTPUT STRUCTURE

Start the document with:
# PERSON - <3–5 word descriptor>

### 1. Core Objective

One paragraph. What systems problem does their entire mental architecture solve?

---

### 2. Key Mental Models (5–7)

For each:

**Name:**
**Definition:** Precise. No promotional language.
**Mechanism:** Internal logic and causal chain. Minimum 3 sentences. Explain WHY it works.
**Example:** *(apply `/humanizer` here only)* Concrete, non-obvious case from their actual domain.
**Failure Case:** Specific failure mode — when and why this model breaks.

Include monospace diagram per model where it clarifies the mechanism.

---

### 3. Decision Framework

Step-by-step system derived from their models.
Must be usable — reader runs a real decision through it.
No `/humanizer` here — keep precise and dry.

---

### 4. Pattern Recognition

Signals that indicate which model is active in a situation.
Format: `condition → model`. Diagram preferred.

---

### 5. Leverage Points

Where applying these models produces disproportionate output.
Focus on second-order effects — what changes downstream when applied correctly vs. incorrectly.

---

### 6. Systems Application

**Backend / Distributed Systems Analogy:** Map their models onto concrete systems concepts. Technically grounded, not metaphorical.

**Career & Decision Architecture:** Their models as decision filters in high-stakes professional choices. Frame as system behavior, not personal advice.

---
