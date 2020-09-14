/**
 * NOTE: This config is used by the Storage class (src/lib/storage/storage) but
 * `migrations` and `entities` are replaced with lists of actual migration and
 * entity classes.
 *
 * New migrations and entities should be added to `migration/index.ts` and
 * `entities/index.ts` respectively
 *
 */
import { entityList } from '@jolocom/sdk-storage-typeorm'
import { ConnectionOptions } from 'typeorm'

// TODO load migrations
const migrations: any[] = []

export default {
  type: 'react-native',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'warn', 'schema'],
  entities: entityList,
  migrations,
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/lib/storage/migration',
  },
} as ConnectionOptions
