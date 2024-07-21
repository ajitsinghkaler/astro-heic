import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.string(),
      shortDescription: z.string(),
      coverImage: image(),
      coverAlt: z.string(),
      coverCaption: z.string(),
      coverOgImage: z.string(),
    }),
});

export const collections = { blog: blogCollection };
