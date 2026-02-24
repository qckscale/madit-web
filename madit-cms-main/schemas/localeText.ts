import {defineField, defineType} from 'sanity'
import {supportedLanguages} from '../sanity.constants'

export default defineType({
  title: 'Localized text',
  name: 'localeText',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: {collapsible: true},
    },
  ],
  fields: supportedLanguages.map((lang) =>
    defineField({
      title: lang.title,
      name: lang.id,
      type: 'text',
      rows: 5,
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
})
