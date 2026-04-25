import type { CollectionEntry } from "astro:content";
import { getCharacterName } from "./characters";

export type SlotType = "anchor" | "secondary" | "quiet";
export type EmphasisLevel = "anchor" | "secondary" | "quiet";
export type Tone = "anchored" | "balanced" | "calm" | "quiet";

export interface CompositionSlotDefinition {
  key: string;
  type: SlotType;
  span: 1 | 2;
  stagger: number;
  emphasis: EmphasisLevel;
  weightBias: number;
}

export interface CompositionTemplate {
  id: string;
  name: string;
  weight: number;
  rhythm: Tone;
  slots: CompositionSlotDefinition[];
  overflow: CompositionSlotDefinition;
  maxSpan: 2;
  maxStagger: number;
}

export interface CompositionPlanItem {
  entry: CharacterEntry;
  slotType: SlotType;
  emphasis: EmphasisLevel;
  tone: Tone;
  span: 1 | 2;
  stagger: number;
  templateId: string;
  templateName: string;
  isAnchor: boolean;
  order: number;
}

export interface CompositionPlan {
  template: CompositionTemplate;
  seed: number;
  items: CompositionPlanItem[];
  fallback: boolean;
}

export type CharacterEntry = CollectionEntry<"characters">;

type SlotSelectionContext = {
  seed: number;
  template: CompositionTemplate;
  previousAnchorId?: string;
};

const PRIORITY_WEIGHTS: Record<string, number> = {
  "Sun-Tzu": 0.5,
  "Marcus-Aurelius": 0.28,
  "Charlie-Munger": 0.18,
  "Carl-Jung": 0.16,
  "Genghis-Khan": 0.12,
  "Grigori-Rasputin": 0.1,
  "Thomas-Shelby": 0.08
};

const SLOT_TYPE_WEIGHTS: Record<SlotType, number> = {
  anchor: 1.35,
  secondary: 1.08,
  quiet: 0.86
};

const EMPHASIS_WEIGHTS: Record<EmphasisLevel, number> = {
  anchor: 1.12,
  secondary: 1,
  quiet: 0.94
};

const TEMPLATES: CompositionTemplate[] = [
  {
    id: "center-anchor",
    name: "Center Anchor",
    weight: 1.35,
    rhythm: "anchored",
    maxSpan: 2,
    maxStagger: 8,
    slots: [
      { key: "center-anchor", type: "anchor", span: 2, stagger: 0, emphasis: "anchor", weightBias: 1.45 },
      { key: "center-secondary-a", type: "secondary", span: 1, stagger: 4, emphasis: "secondary", weightBias: 1.12 },
      { key: "center-quiet-a", type: "quiet", span: 1, stagger: 2, emphasis: "quiet", weightBias: 0.8 },
      { key: "center-secondary-b", type: "secondary", span: 1, stagger: 6, emphasis: "secondary", weightBias: 1.04 },
      { key: "center-quiet-b", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.78 },
      { key: "center-quiet-c", type: "quiet", span: 1, stagger: 8, emphasis: "quiet", weightBias: 0.76 },
      { key: "center-quiet-d", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.74 }
    ],
    overflow: { key: "center-overflow", type: "quiet", span: 1, stagger: 6, emphasis: "quiet", weightBias: 0.7 }
  },
  {
    id: "left-anchor-dense-middle",
    name: "Left Anchor / Dense Middle",
    weight: 1.08,
    rhythm: "balanced",
    maxSpan: 2,
    maxStagger: 8,
    slots: [
      { key: "left-anchor", type: "anchor", span: 1, stagger: 0, emphasis: "anchor", weightBias: 1.36 },
      { key: "left-secondary-a", type: "secondary", span: 2, stagger: 4, emphasis: "secondary", weightBias: 1.16 },
      { key: "left-secondary-b", type: "secondary", span: 1, stagger: 2, emphasis: "secondary", weightBias: 1.08 },
      { key: "left-quiet-a", type: "quiet", span: 1, stagger: 6, emphasis: "quiet", weightBias: 0.82 },
      { key: "left-quiet-b", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.8 },
      { key: "left-quiet-c", type: "quiet", span: 1, stagger: 8, emphasis: "quiet", weightBias: 0.76 },
      { key: "left-quiet-d", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.74 }
    ],
    overflow: { key: "left-overflow", type: "quiet", span: 1, stagger: 6, emphasis: "quiet", weightBias: 0.7 }
  },
  {
    id: "high-anchor-balanced-spread",
    name: "High Anchor / Balanced Spread",
    weight: 1.2,
    rhythm: "balanced",
    maxSpan: 2,
    maxStagger: 8,
    slots: [
      { key: "high-secondary-a", type: "secondary", span: 1, stagger: 0, emphasis: "secondary", weightBias: 1.02 },
      { key: "high-anchor", type: "anchor", span: 2, stagger: 2, emphasis: "anchor", weightBias: 1.42 },
      { key: "high-secondary-b", type: "secondary", span: 1, stagger: 4, emphasis: "secondary", weightBias: 1.1 },
      { key: "high-quiet-a", type: "quiet", span: 1, stagger: 2, emphasis: "quiet", weightBias: 0.82 },
      { key: "high-quiet-b", type: "quiet", span: 1, stagger: 6, emphasis: "quiet", weightBias: 0.78 },
      { key: "high-quiet-c", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.76 },
      { key: "high-quiet-d", type: "quiet", span: 1, stagger: 8, emphasis: "quiet", weightBias: 0.74 }
    ],
    overflow: { key: "high-overflow", type: "quiet", span: 1, stagger: 6, emphasis: "quiet", weightBias: 0.7 }
  },
  {
    id: "low-anchor-quiet-opening",
    name: "Low Anchor / Quiet Opening",
    weight: 0.96,
    rhythm: "quiet",
    maxSpan: 2,
    maxStagger: 8,
    slots: [
      { key: "low-quiet-a", type: "quiet", span: 1, stagger: 0, emphasis: "quiet", weightBias: 0.9 },
      { key: "low-quiet-b", type: "quiet", span: 1, stagger: 2, emphasis: "quiet", weightBias: 0.86 },
      { key: "low-anchor", type: "anchor", span: 1, stagger: 4, emphasis: "anchor", weightBias: 1.38 },
      { key: "low-secondary-a", type: "secondary", span: 1, stagger: 6, emphasis: "secondary", weightBias: 1.08 },
      { key: "low-secondary-b", type: "secondary", span: 1, stagger: 2, emphasis: "secondary", weightBias: 1.02 },
      { key: "low-quiet-c", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.76 },
      { key: "low-quiet-d", type: "quiet", span: 1, stagger: 6, emphasis: "quiet", weightBias: 0.74 }
    ],
    overflow: { key: "low-overflow", type: "quiet", span: 1, stagger: 4, emphasis: "quiet", weightBias: 0.7 }
  }
];

const FALLBACK_TEMPLATE: CompositionTemplate = {
  id: "fallback-grid",
  name: "Fallback Grid",
  weight: 1,
  rhythm: "calm",
  maxSpan: 2,
  maxStagger: 4,
  slots: [],
  overflow: { key: "fallback-overflow", type: "quiet", span: 1, stagger: 0, emphasis: "quiet", weightBias: 0.7 }
};

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

const toSpan = (value: number, maximum: number): 1 | 2 => {
  return clamp(value, 1, Math.min(maximum, 2)) >= 2 ? 2 : 1;
};

const hashString = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const createSeed = (date: Date, entries: CharacterEntry[]) => {
  const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
  const collectionSignature = entries.map((entry) => entry.id).join("|");
  const seed = hashString(`${monthKey}:${collectionSignature}`);

  return { seed, monthKey, collectionSignature };
};

const getPreviousMonthDate = (date: Date) => {
  const previous = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  previous.setUTCMonth(previous.getUTCMonth() - 1);
  return previous;
};

const candidateMetadataWeight = (entry: CharacterEntry) => {
  const rating = entry.data.rating ?? 0;
  const ratingWeight = rating > 0 ? (rating / 10) * 0.16 : 0;
  const coverWeight = entry.data.cover ? 0.08 : 0;
  const lengthWeight = clamp((entry.body.length || 0) / 5000, 0, 1) * 0.08;
  const tagWeight = clamp(entry.data.tags?.length ?? 0, 0, 4) * 0.012;
  const seriesWeight = entry.data.series ? 0.02 : 0;
  const editorialWeight = PRIORITY_WEIGHTS[entry.id] ?? 0.04;

  return editorialWeight + ratingWeight + coverWeight + lengthWeight + tagWeight + seriesWeight;
};

const slotBiasWeight = (slot: CompositionSlotDefinition) => {
  return SLOT_TYPE_WEIGHTS[slot.type] * EMPHASIS_WEIGHTS[slot.emphasis] * slot.weightBias;
};

const jitterWeight = (seed: number, entryId: string, slotKey: string) => {
  const random = createRandom(hashString(`${seed}:${entryId}:${slotKey}`));
  return 0.92 + random() * 0.16;
};

const scoreCandidate = (
  entry: CharacterEntry,
  slot: CompositionSlotDefinition,
  context: SlotSelectionContext
) => {
  let weight = candidateMetadataWeight(entry) * slotBiasWeight(slot) * jitterWeight(context.seed, entry.id, slot.key);

  if (context.previousAnchorId && entry.id === context.previousAnchorId) {
    weight *= 0.58;
  }

  if (slot.type === "anchor") {
    weight *= 1.15;
  }

  return Math.max(weight, 0.01);
};

const pickWeighted = <T>(items: Array<{ item: T; weight: number }>, seed: number) => {
  const filtered = items.filter((item) => Number.isFinite(item.weight) && item.weight > 0);

  if (!filtered.length) {
    return undefined;
  }

  const random = createRandom(seed);
  const total = filtered.reduce((sum, item) => sum + item.weight, 0);
  let cursor = random() * total;

  for (const item of filtered) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.item;
    }
  }

  return filtered[filtered.length - 1]?.item;
};

const selectTemplate = (
  entries: CharacterEntry[],
  seed: number,
  previousTemplateId?: string
) => {
  const random = createRandom(seed);
  const weightedTemplates = TEMPLATES.map((template) => {
    let weight = template.weight;

    if (template.id === previousTemplateId) {
      weight *= 0.78;
    }

    if (entries.length <= 4 && template.id === "high-anchor-balanced-spread") {
      weight *= 0.9;
    }

    if (entries.length >= 7 && template.id === "center-anchor") {
      weight *= 1.04;
    }

    return { item: template, weight };
  });

  return pickWeighted(weightedTemplates, seed + Math.floor(random() * 9973)) ?? TEMPLATES[0];
};

const expandSlots = (template: CompositionTemplate, count: number) => {
  if (!template.slots.length) {
    return Array.from({ length: count }, (_, index) => ({
      key: `${template.id}-fallback-${index}`,
      type: "quiet" as SlotType,
      span: 1 as const,
      stagger: 0,
      emphasis: "quiet" as EmphasisLevel,
      weightBias: 0.7
    }));
  }

  if (count <= template.slots.length) {
    return template.slots.slice(0, count);
  }

  const slots = [...template.slots];

  while (slots.length < count) {
    const index = slots.length;
    const overflow = template.overflow;

    slots.push({
      ...overflow,
      key: `${template.id}-overflow-${index}`,
      stagger: clamp(overflow.stagger + (index % 2 === 0 ? 0 : 2), 0, template.maxStagger)
    });
  }

  return slots;
};

const selectEntryForSlot = (
  available: CharacterEntry[],
  slot: CompositionSlotDefinition,
  context: SlotSelectionContext,
  seedOffset: number
) => {
  const weighted = available.map((entry) => ({
    item: entry,
    weight: scoreCandidate(entry, slot, context)
  }));

  return pickWeighted(weighted, context.seed + seedOffset) ?? available[0];
};

const buildFallbackPlan = (entries: CharacterEntry[]): CompositionPlan => {
  const sorted = [...entries].sort((left, right) => getCharacterName(left).localeCompare(getCharacterName(right)));

  return {
    template: FALLBACK_TEMPLATE,
    seed: 0,
    fallback: true,
    items: sorted.map((entry, index) => ({
      entry,
      slotType: "quiet",
      emphasis: "quiet",
      tone: "calm",
      span: 1,
      stagger: 0,
      templateId: FALLBACK_TEMPLATE.id,
      templateName: FALLBACK_TEMPLATE.name,
      isAnchor: index === 0,
      order: index
    }))
  };
};

export const buildCompositionPlan = (
  entries: CharacterEntry[],
  options: { date?: Date } = {}
): CompositionPlan => {
  try {
    if (!entries.length) {
      return buildFallbackPlan(entries);
    }

    const date = options.date ?? new Date();
    const currentSeedInfo = createSeed(date, entries);
    const previousSeedInfo = createSeed(getPreviousMonthDate(date), entries);
    const previousTemplate = selectTemplate(entries, previousSeedInfo.seed);
    const template = selectTemplate(entries, currentSeedInfo.seed, previousTemplate.id);
    const slots = expandSlots(template, entries.length);
    const previousAnchor = selectAnchor(entries, previousSeedInfo.seed, previousTemplate);
    const context: SlotSelectionContext = {
      seed: currentSeedInfo.seed,
      template,
      previousAnchorId: previousAnchor?.id
    };

    const available = [...entries];
    const plan: CompositionPlanItem[] = [];

    const anchorSlotIndex = slots.findIndex((slot) => slot.type === "anchor");
    if (anchorSlotIndex >= 0 && available.length) {
      const anchorSlot = slots[anchorSlotIndex];
      const anchorEntry = selectEntryForSlot(available, anchorSlot, context, anchorSlotIndex + 1);
      removeEntry(available, anchorEntry);
      plan[anchorSlotIndex] = {
        entry: anchorEntry,
        slotType: anchorSlot.type,
        emphasis: anchorSlot.emphasis,
        tone: template.rhythm,
        span: toSpan(anchorSlot.span, template.maxSpan),
        stagger: clamp(anchorSlot.stagger, 0, template.maxStagger),
        templateId: template.id,
        templateName: template.name,
        isAnchor: true,
        order: anchorSlotIndex
      };
    }

    slots.forEach((slot, index) => {
      if (plan[index]) {
        return;
      }

      const selected = selectEntryForSlot(available, slot, context, (index + 1) * 97);
      removeEntry(available, selected);

      plan[index] = {
        entry: selected,
        slotType: slot.type,
        emphasis: slot.emphasis,
        tone: template.rhythm,
        span: toSpan(slot.span, template.maxSpan),
        stagger: clamp(slot.stagger, 0, template.maxStagger),
        templateId: template.id,
        templateName: template.name,
        isAnchor: slot.type === "anchor",
        order: index
      };
    });

    return {
      template,
      seed: currentSeedInfo.seed,
      items: plan.filter((item): item is CompositionPlanItem => Boolean(item)),
      fallback: false
    };
  } catch {
    return buildFallbackPlan(entries);
  }
};

const selectAnchor = (
  entries: CharacterEntry[],
  seed: number,
  template: CompositionTemplate
) => {
  if (!entries.length) {
    return undefined;
  }

  const anchorSlot = template.slots.find((slot) => slot.type === "anchor") ?? template.overflow;
  const context: SlotSelectionContext = { seed, template };
  return selectEntryForSlot(entries, anchorSlot, context, 1);
};

const removeEntry = (entries: CharacterEntry[], entry: CharacterEntry) => {
  const index = entries.findIndex((candidate) => candidate.id === entry.id);
  if (index >= 0) {
    entries.splice(index, 1);
  }
};
