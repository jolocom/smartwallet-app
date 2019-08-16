import { entityList } from './src/lib/storage/entities'
import { Initial1565886000404 } from './src/lib/storage/migration/1565886000404-initial'

module.exports = {
  type: 'sqlite',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'query', 'schema'],
  entities: entityList,
  migrations: [Initial1565886000404],
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/lib/storage/migration',
  },
}
