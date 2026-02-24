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
      // validation: (Rule) =>
      //   Rule.max(50).warning('Longer titles may be truncated by search engines'),
    }),
    defineField({
      name: 'content',
      type: 'localeText',
      title: 'Content',
      description: 'Will be placed in the <meta name="content"> tag',
      // validation: (Rule) =>
      //   Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
  ],
})
