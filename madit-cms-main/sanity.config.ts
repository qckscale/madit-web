import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {codeInput} from '@sanity/code-input'

export default defineConfig({
  name: 'default',
  title: 'madit-web',

  projectId: 'rtmjambs',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Articles').child(S.documentTypeList('post').title('Articles')),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem().title('Pages').child(S.documentTypeList('page').title('Pages')),
            S.listItem().title('Authors').child(S.documentTypeList('author').title('Authors')),
            S.listItem().title('Services').child(S.documentTypeList('services').title('Services')),
            S.listItem().title('Work').child(S.documentTypeList('work').title('Work')),
            S.listItem()
              .title('Testimonials')
              .child(S.documentTypeList('testimonial').title('Testimonial')),
            S.divider(),
            S.listItem()
              .title('Settings')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.listItem()
                      .title('General')
                      .child(S.editor().id('generalSettings').schemaType('generalSettings')),
                  ]),
              ),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
