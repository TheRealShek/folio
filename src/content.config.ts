import { defineCollection, z } from "astro:content";

const characters = defineCollection({
  schema: z.object({
    name: z.string().optional(),
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
