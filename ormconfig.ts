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
  logging: ['error', 'warn', 'schema'],
  entities: ['./src/lib/storage/entities/*.ts'],
  migrations: ['./src/lib/storage/migration/*.ts'],
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/lib/storage/migration',
  },
}
