import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      group: 'content',
      description: 'The H1-tag',
      type: 'localeString',
    }),
    defineField({
      title: 'Heo image',
      name: 'heroImage',
      group: 'content',
      type: 'image',
    }),
    defineField({
      title: 'Call-to-action Primary text',
      name: 'ctaPrimary',
      group: 'content',
      type: 'localeString',
    }),
    defineField({
      title: 'Call-to-action Secondary text',
      name: 'ctaSecondary',
      group: 'content',
      type: 'localeString',
    }),
    defineField({
      title: 'Service title',
      name: 'serviceTitle',
      group: 'content',
      type: 'localeString',
    }),
    defineField({
      title: 'Services',
      name: 'services',
      group: 'content',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'services'}]}],
    }),
    defineField({
      title: 'Blog title',
      name: 'newsTitle',
      group: 'content',
      type: 'localeString',
    }),
    defineField({
      title: 'Testimonial title',
      name: 'testimonialTitle',
      group: 'content',
      type: 'localeString',
    }),
    defineField({
      title: 'Testimonial sub-title text',
      name: 'testimonialSubtitle',
      group: 'content',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
      title: 'SEO',
    }),
  ],
})
