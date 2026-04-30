{/_ ============================================================
PROMPT: Mental Models & Decision Systems Analysis
Usage: replace the value of PERSON below, then run.
============================================================ _/}

PERSON = [insert name]

---

## FRONTMATTER

Every MDX output MUST start with this YAML frontmatter block. Fill in all fields before writing the analysis body.

```yaml
---
name: "[Full display name]"
subtitle: "[3–7 word descriptor of their core operating principle]"
domain: "[primary field — e.g. military, investing, psychology, physics, philosophy, technology, power, fiction]"
era: "[birth–death years or active period — e.g. '1924–2023', '544–496 BCE', '1920s']"
fictional: [true if character is fictional, false otherwise]
---
```

Rules:

- `subtitle` must be a compressed thesis, not a biography label. Bad: "Famous Physicist". Good: "Anti-Fooling System Architect"
- `domain` is a single lowercase word. Use the most specific accurate term.
- `era` uses en-dashes (–), not hyphens (-). Add "BCE" or "CE" suffix where ambiguous.
- `fictional` defaults to `false`. Set `true` only for characters from fiction (TV, film, literature, games).

## STEP 1: RESEARCH

Web search PERSON. Pull primary sources — their own writing, interviews, documented decisions, failures.
Ignore Wikipedia summaries, motivational bios, secondhand accounts.
Extract: how they actually reasoned, what they optimized for, where they failed, and they became this good in what did.

---

## CONSTRAINTS

- No biography, no life events, no dates in output
- No motivational tone
- Write at 8th-grade reading level. No academic vocabulary.
- Frameworks must be operationalizable — reader can run a real decision through them
- Mechanisms must explain WHY the model works, not just label it
- Skip anything findable in first Google result — prioritize second-order effects and non-obvious failure cases
- Don't use any information about me directly in the document
- `/humanizer` applies exclusively to `Example` fields — nowhere else
- Output as MDX document. No JSX components unless diagrams require it.
- All diagrams use this exact tag and format — no exceptions:

<pre style="background: transparent; border: none; overflow-x: auto; font-family: monospace; color: var(--text-muted); font-size: 0.85em; white-space: pre-wrap;">
{`LABEL:
  line one
  line two`}
</pre>

CRITICAL: diagram content MUST be inside {` `} (JSX template literal).
Bare text inside <pre> will have newlines eaten by the MDX parser.

---

## OUTPUT STRUCTURE

Start the document with:

### 1. Core Objective

One paragraph. What systems problem does their entire mental architecture solve?

---

### 2. Key Mental Models (5–7)

For each:

**Name:**
**Definition:** Precise. No promotional language.
**Mechanism:** Internal logic and causal chain. Minimum 3 sentences. Explain WHY it works.
**Example:** _(apply `/humanizer` here only)_ Concrete, non-obvious case from their actual domain.
**Failure Case:** Specific failure mode — when and why this model breaks.

Include monospace diagram per model where it clarifies the mechanism and shows the essence of the model.

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
