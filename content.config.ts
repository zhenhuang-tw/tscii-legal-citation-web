import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    citation_style: defineCollection({
      type: 'data',
      source: 'citation-style.json',
      schema: z.object({
        sourceDataIntroduction: z.object({
          supportedBy: z.string(),
          project: z.string(),
          name: z.string(),
          lastUpdated: z.string(),
          sourceURI: z.string(),
          sourceDescription: z.string(),
        }),
        schema: z.object({
          categories: z.string(),
          format: z.string(),
          differences: z.array(z.string()),
        }),
        // `rule` is a recursive tree; full structural validation is deferred
        // to the CitationRule TypeScript interface at usage sites.
        rule: z.array(z.any()),
      }),
    }),
  },
})
