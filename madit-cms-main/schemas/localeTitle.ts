import {defineField, defineType} from 'sanity'
import {supportedLanguages} from '../sanity.constants'
import {isUniqueAcrossAllDocuments} from '../lib/isUniqueAcrossAllDocuments'

export default defineType({
  title: 'Localized title',
  name: 'localeTitle',
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
      type: 'string',
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
})
