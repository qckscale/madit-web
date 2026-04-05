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
      name: 'category',
      group: 'content',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Konsulttjänst', value: 'consulting'},
          {title: 'Utbildning', value: 'training'},
          {title: 'Produkter', value: 'products'},
        ],
        layout: 'radio',
      },
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
    // Training-specific fields
    defineField({
      name: 'duration',
      group: 'content',
      title: 'Duration',
      type: 'string',
      options: {
        list: [
          {title: '2 timmar', value: '2h'},
          {title: 'Halvdag', value: 'half_day'},
          {title: 'Heldag', value: 'full_day'},
          {title: 'Flerdagar', value: 'multi_day'},
        ],
      },
      hidden: ({document}) => document?.category !== 'training',
    }),
    defineField({
      name: 'targetAudience',
      group: 'content',
      title: 'Target Audience',
      description: 'Who is this training for?',
      type: 'localeText',
      hidden: ({document}) => document?.category !== 'training',
    }),
    defineField({
      name: 'prerequisites',
      group: 'content',
      title: 'Prerequisites',
      description: 'Required knowledge before attending',
      type: 'localeText',
      hidden: ({document}) => document?.category !== 'training',
    }),
    // Product-specific fields
    defineField({
      name: 'deliverables',
      group: 'content',
      title: 'Deliverables',
      description: 'What the customer receives',
      type: 'localeBlockContent',
      hidden: ({document}) => document?.category !== 'products',
    }),
    defineField({
      name: 'estimatedTimeline',
      group: 'content',
      title: 'Estimated Timeline',
      description: 'E.g. "2-4 veckor"',
      type: 'localeString',
      hidden: ({document}) => document?.category !== 'products',
    }),
    defineField({
      name: 'startingPrice',
      group: 'content',
      title: 'Starting Price',
      description: 'E.g. "Från 45 000 SEK"',
      type: 'localeString',
      hidden: ({document}) => document?.category !== 'products',
    }),
    defineField({
      name: 'serviceDetails',
      group: 'content',
      title: 'Service Details',
      description: 'Items shown in the details box (e.g. Längd, Målgrupp, Förkunskaper)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'localeString', title: 'Label'},
            {name: 'value', type: 'localeText', title: 'Value'},
          ],
          preview: {
            select: {title: 'label.sv', subtitle: 'value.sv'},
          },
        },
      ],
    }),
    defineField({
      name: 'instructors',
      group: 'content',
      title: 'Instructors / Consultants',
      description: 'People who lead this service or training',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'author'}]}],
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
      category: 'category',
      media: 'icon',
    },
    prepare(selection) {
      const categoryLabels: Record<string, string> = {
        consulting: 'Konsulttjänst',
        training: 'Utbildning',
        products: 'Produkter',
      }
      return {
        ...selection,
        subtitle: categoryLabels[selection.category] || 'Ingen kategori',
      }
    },
  },
})
