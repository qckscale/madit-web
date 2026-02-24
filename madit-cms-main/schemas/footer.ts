import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.regex(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
          {
            name: 'email', // Error message is "Does not match email-pattern"
            invert: false, // Boolean to allow any value that does NOT match pattern
          },
        ),
    }),
    defineField({
      name: 'pagesOfInterest',
      title: 'MadIT links',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'page'}, {type: 'services'}]}],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'localeString',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'string',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter URL',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'string',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'string',
    }),
  ],
})
