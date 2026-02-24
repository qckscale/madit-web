import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Name of the person giving the testimonial',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
  ],
  initialValue: () => ({
    publishedAt: new Date().toISOString(),
  }),
  preview: {
    select: {
      title: 'name',
      media: 'thumbnail',
    },
  },
})
