import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'generalSettings',
  title: 'General settings',
  type: 'document',
  groups: [
    {title: 'SEO', name: 'seo'},
    {title: 'Footer', name: 'footer'},
    {title: 'Cookie consent', name: 'cookieConsent'},
  ],
  fields: [
    defineField({
      title: 'Home page details',
      name: 'homePage',
      type: 'reference',
      to: [{type: 'homePage'}],
    }),
    defineField({
      title: 'Footer',
      group: 'footer',
      name: 'footer',
      type: 'reference',
      to: [{type: 'footer'}],
    }),
    defineField({
      title: 'Cookie settings',
      group: 'cookieConsent',
      name: 'cookieSettings',
      type: 'cookieSettings',
    }),

    defineField({
      title: 'SEO settings',
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
