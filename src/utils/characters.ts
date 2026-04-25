interface CharacterData {
  name?: string;
  series?: string;
  type?: "anime" | "manga" | "comics" | "game";
  rating?: number;
  tags?: string[];
  cover?: string;
  spoilers?: boolean;
}

interface CharacterEntry {
  id: string;
  body: string;
  data: CharacterData;
}

const stripMarkdown = (value: string) =>
  value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_`>#~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const extractHeading = (body: string) => {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? stripMarkdown(match[1]) : "";
};

const normalizeName = (value: string, fallbackId: string) => {
  const heading = value || fallbackId.replace(/[-_]+/g, " ");
  const split = heading.split(/\s+[—–-]\s+|:\s+/)[0]?.trim();
  return split || heading;
};

export const getCharacterName = (entry: CharacterEntry) => {
  return entry.data.name?.trim() || normalizeName(extractHeading(entry.body), entry.id);
};

export const getCharacterDescription = (entry: CharacterEntry) => {
  const withoutHeading = entry.body.replace(/^#\s+.+$/m, "").trim();
  return stripMarkdown(withoutHeading).slice(0, 160).trim();
};

export const getCharacterSlug = (entry: CharacterEntry) => {
  return entry.id.replace(/\.mdx?$/i, "");
};
