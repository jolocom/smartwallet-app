import typeOrmConf from '../ormconfig'

const env = process.env['NODE_ENV'] || 'development'
const isDev = env === 'development'
const isTest = env === 'test'

export const skipEntropyCollection = isDev || isTest
export const skipIdentityRegisteration = isDev || isTest

export default {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf,
}
