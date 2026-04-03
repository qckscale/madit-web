import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Title',
      description: 'Will be placed in the <title> tag',
    }),
    defineField({
      name: 'content',
      type: 'localeText',
      title: 'Meta Description',
      description: 'Will be placed in the <meta name="description"> tag',
    }),
    defineField({
      name: 'ogImage',
      type: 'image',
      title: 'Open Graph Image',
      description: 'Image shown when sharing on social media. Recommended: 1200x630px.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'canonicalUrl',
      type: 'string',
      title: 'Canonical URL',
      description: 'Only set this if the canonical URL should differ from the page\'s own URL.',
    }),
    defineField({
      name: 'noIndex',
      type: 'boolean',
      title: 'Hide from search engines',
      description: 'If enabled, search engines will not index this page.',
      initialValue: false,
    }),
  ],
})
