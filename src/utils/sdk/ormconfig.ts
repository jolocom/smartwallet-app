import { entityList } from '@jolocom/sdk-storage-typeorm'
import { ConnectionOptions } from 'typeorm'

export default {
  type: 'react-native',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'warn', 'schema'],
  entities: entityList,
  //migrations: ['~/utils/sdk/migrations/*.ts'],
  //migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: '~/utils/sdk/migrations',
  },
} as ConnectionOptions
