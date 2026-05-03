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

Run three mandatory search passes. Do not skip or merge passes.

**Pass 1 — General:** Who they are, what they're known for, primary domain.
**Pass 2 — Contrarian:** Critics, failures, what they got wrong, minority opinions.
**Pass 3 — Obscure:** Interviews 5+ years old, edge cases, unpopular stances, decisions that didn't work out.

Pass 2 and 3 are mandatory. Output from Pass 1 alone is biography, not analysis.

Before writing anything, output this block:

SOURCES:

- Primary (their own words — writing, interviews, documented decisions): [list]
- Secondary with direct quotes: [list]
- Secondary without quotes: [list — these cannot support mechanism claims]

If Primary list has fewer than 3 entries: state why and flag all mechanism claims as "inferred, not sourced."
Do not fabricate interview quotes. Do not treat secondary analysis as primary.

Web search PERSON. Pull primary sources — their own writing, interviews, documented decisions, failures.
Ignore Wikipedia summaries, motivational bios, secondhand accounts.

**If PERSON lived before 1800 or no primary sources are web-accessible:** use oldest available direct translations of their original texts. Label all sourcing as "via [translator/edition]" and flag inline.

---

## CONSTRAINTS

- No biography, no life events, no dates in output
- No motivational tone
- Plain language. No academic vocabulary. No jargon unless the term has no plain equivalent — if you use jargon, define it in one phrase immediately after.
  - Mechanism sections: complexity is allowed, but sentences must be direct. Causal chains must be explicit ("X causes Y because Z"), not implied.
- Frameworks must be operationalizable — reader can run a real decision through them
- Mechanisms must explain WHY the model works, not just label it
- Skip anything findable in first Google result — prioritize second-order effects and non-obvious failure cases
- **Humanizer rules apply exclusively to `Example` fields — nowhere else.** When writing Example fields, remove all signs of AI-generated text: no significance inflation, no promotional language, no superficial -ing phrases, no vague attributions, no em dash overuse, no rule-of-three patterns, no synonym cycling, no passive voice where active works, no negative parallelisms ("not just X, but Y"), no filler phrases. Write with a specific voice — have opinions, vary rhythm, use "I" when it fits, let some mess in. Be specific about observations rather than making neutral reports.
- Do not read any skills, tools, or external files before writing except /mnt/skills/user/humanizer/SKILL.md, which must be read before writing any Example field.
- Deliver output as a .mdx file. Do not output MDX inline in the response. No JSX components unless diagrams require it.
- All diagrams use this exact tag and format — no exceptions:

<pre style="background: transparent; border: none; overflow-x: auto; font-family: monospace; color: var(--text-muted); font-size: 0.85em; white-space: pre-wrap;">
{`LABEL:
  line one
  line two`}
</pre>

CRITICAL: diagram content MUST be inside {` `} (JSX template literal). Bare text inside <pre> will have newlines eaten by the MDX parser.

---

## OUTPUT STRUCTURE

Start the document with:

### 1. Core Objective

One paragraph. What systems problem does their entire mental architecture solve?

---

### 2. Key Mental Models

Before listing any model, run this filter on each candidate:

1. Is this model specific to PERSON or generic ("first principles thinking", "inversion", "second-order thinking")? Generic → cut it.
2. Can you cite a specific decision or text where this model was demonstrably active? No cite → cut it.
3. Does this model tension or contradict another model in the list? No tension anywhere → you have duplicates dressed differently → cut to the one with best evidence.

Target: 3–5 models that survive this filter. Prefer 3 sharp over 7 dull.

For each:

**Name:**
**Definition:** Precise. No promotional language.
**Mechanism:** Internal logic and causal chain. Minimum 3 sentences. Explain WHY it works.
**Example:** Concrete, non-obvious case from their actual domain. _(humanizer rules apply here — see CONSTRAINTS)_
**Failure Case:** Specific failure mode — when and why this model breaks.

Include monospace diagram per model where the model has a loop, pipeline, or multi-stage structure. If none of those apply, omit the diagram.

---

### 3. Decision Framework

Step-by-step system derived from their models.
Must be usable — reader runs a real decision through it.
No humanizer rules here — keep precise and dry.

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

For each subsection, structure as two labeled blocks:

- `Applied correctly:` — what the downstream system state looks like
- `Applied incorrectly:` — specific failure mode, not just "worse outcome"
