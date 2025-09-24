// 1. Importar las utilidades de `astro:content` como Zod
import { z, defineCollection } from 'astro:content';

// 2. Definir un `type` y `schema` con zod para cada colección
const portfolioCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    // layout: z.string(), 
    name: z.string(), 
    title: z.string(), 
    desc: z.string(), 
    snap: z.string(), 
    menu: z.number(),
    tags: z.array(z.string()),
    // date: z.string().optional()
  }),
});

// 3. Exportar el objeto `collections` 
export const collections = {
  'portfolio': portfolioCollection
};