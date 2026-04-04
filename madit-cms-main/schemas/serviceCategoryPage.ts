import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'serviceCategoryPage',
  title: 'Service Category Pages',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
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
      name: 'title',
      group: 'content',
      title: 'Title',
      type: 'localeString',
    }),
    defineField({
      name: 'ingress',
      group: 'content',
      title: 'Ingress',
      description: 'Short description shown on the services overview page',
      type: 'localeText',
    }),
    defineField({
      name: 'content',
      group: 'content',
      title: 'Content',
      description: 'Intro text shown above the service listings',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Icon shown on the services overview card',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
      title: 'SEO',
    }),
  ],
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
        title: selection.title || categoryLabels[selection.category] || 'Ny kategori',
        subtitle: categoryLabels[selection.category],
      }
    },
  },
})
