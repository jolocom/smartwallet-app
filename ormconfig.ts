/**
 * NOTE: This config is used by the Storage class (src/lib/storage/storage) but
 * `migrations` and `entities` are replaced with lists of actual migration and
 * entity classes.
 *
 * New migrations and entities should be added to `migration/index.ts` and
 * `entities/index.ts` respectively
 *
 */
export default {
  type: 'react-native',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'query', 'schema'],
  entities: './src/lib/storage/entities/',
  migrations: './src/lib/storage/migration/',
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/lib/storage/migration',
  },
}
