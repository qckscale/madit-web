import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
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
      name: 'title',
      group: 'content',
      title: 'Title',
      type: 'localeString',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      group: 'content',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'publishedAt',
      group: 'content',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'ingress',
      group: 'content',
      title: 'Ingress',
      description: 'Short description of the service item',
      type: 'localeText',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      group: 'content',
      title: 'Content',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
      title: 'SEO',
    }),
  ],
  initialValue: () => ({
    publishedAt: new Date().toISOString(),
  }),
  preview: {
    select: {
      title: 'title.sv',
      media: 'mainImage',
    },
  },
})
