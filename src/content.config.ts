import { defineCollection, z } from "astro:content";

const characters = defineCollection({
  schema: z.object({
    name: z.string().optional(),
    subtitle: z.string().optional(),
    domain: z.string().optional(),
    era: z.string().optional(),
    fictional: z.boolean().optional(),
    series: z.string().optional(),
    type: z.enum(["anime", "manga", "comics", "game"]).optional(),
    rating: z.number().min(0).max(10).optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    spoilers: z.boolean().optional()
  })
});

export const collections = {
  characters
};
