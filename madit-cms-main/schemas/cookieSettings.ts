import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Cookie Consent Settings',
  name: 'cookieSettings',
  type: 'object',
  fields: [
    defineField({
      title: 'Enable Cookie Consent?',
      name: 'enabled',
      type: 'boolean',
    }),
    defineField({
      title: 'Message',
      name: 'message',
      type: 'localeText',
      description: 'Your cookie consent message',
    }),
    defineField({
      title: 'CTA text',
      description: 'The text on the button that accepts cookies',
      name: 'ctaText',
      type: 'localeString',
    }),
    defineField({
      title: 'Link text',
      name: 'linkText',
      type: 'localeString',
    }),
    defineField({
      title: 'Link',
      name: 'link',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'Show a link to "Learn More" about your cookie policy',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Cookie Consent Settings',
      }
    },
  },
})
