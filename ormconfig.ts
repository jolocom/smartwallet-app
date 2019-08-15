module.exports = {
  type: 'sqlite',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'query', 'schema'],
  entities: ['src/lib/storage/entities/*.ts'],
  migrations: ['src/lib/storage/migrations/*'],
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/lib/storage/migration',
  },
}
