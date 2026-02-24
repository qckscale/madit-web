import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'services',
  title: 'Services',
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
      name: 'icon',
      title: 'Service icon',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'order',
      group: 'content',
      title: 'Order',
      description: 'The order they should be sorted in',
      type: 'number',
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
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
