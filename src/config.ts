import typeOrmConf from '../ormconfig'

const env = process.env['NODE_ENV'] || 'development'
const isDev = env === 'development'
// @ts-ignore
const isTest = env === 'test'
const isTestE2E = env === 'test-e2e'

export const skipEntropyCollection = isDev || isTest || isTestE2E
export const skipIdentityRegisteration = isDev || isTestE2E

export default {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf,
}
