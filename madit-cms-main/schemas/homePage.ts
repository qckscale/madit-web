import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      description: 'The H1-tag',
      type: 'localeString',
    }),
    defineField({
      title: 'Heo image',
      name: 'heroImage',
      type: 'image',
    }),
    defineField({
      title: 'Call-to-action Primary text',
      name: 'ctaPrimary',
      type: 'localeString',
    }),
    defineField({
      title: 'Call-to-action Secondary text',
      name: 'ctaSecondary',
      type: 'localeString',
    }),

    defineField({
      title: 'Service title',
      name: 'serviceTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Services',
      name: 'services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'services'}]}],
    }),
    defineField({
      title: 'Blog title',
      name: 'newsTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Testimonial title',
      name: 'testimonialTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Testimonial sub-title text',
      name: 'testimonialSubtitle',
      type: 'localeBlockContent',
    }),
  ],
})
