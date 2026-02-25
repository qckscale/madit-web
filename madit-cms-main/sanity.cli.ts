import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'rtmjambs',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})
