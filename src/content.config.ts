import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts: one Markdown file per post in src/content/blog. The file name is the URL slug.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    readingMinutes: z.number(),
    featured: z.boolean().default(false),
    // true = starter article written for launch; have the dentist review it, then set to false
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { blog };
