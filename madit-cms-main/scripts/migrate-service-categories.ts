/**
 * Migration script: Set category on all existing service documents.
 *
 * Run AFTER deploying the updated schema (`npm run deploy`):
 *   npx sanity exec scripts/migrate-service-categories.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient().withConfig({apiVersion: '2024-01-01'})

const categoryMapping: Record<string, string> = {
  'azure-consulting': 'consulting',
  'effective-azure-training': 'training',
  'simplified-analysis': 'products',
  'secure-azure-implementation': 'products',
  'azure-ai-solutions': 'products',
  'azure-migration': 'products',
  'valuable-automation': 'products',
  'safe-azure-monitoring': 'products',
  'azure-integration': 'products',
  'azure-data-mangement': 'products',
  'azure-security-compliance': 'products',
  'azure-devops': 'products',
}

async function migrate() {
  const services = await client.fetch<{_id: string; slug: string}[]>(
    `*[_type == "services"]{ _id, "slug": slug.current }`,
  )

  const transaction = client.transaction()

  for (const service of services) {
    const category = categoryMapping[service.slug]
    if (category) {
      console.log(`Setting ${service.slug} → ${category}`)
      transaction.patch(service._id, (patch) => patch.set({category}))
    } else {
      console.warn(`No mapping for slug: ${service.slug}`)
    }
  }

  const result = await transaction.commit()
  console.log(`Migrated ${result.documentIds.length} documents`)
}

migrate().catch(console.error)
