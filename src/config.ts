import typeOrmConf from '../ormconfig'
import { ConnectionOptions } from 'typeorm/browser'

export default {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf as ConnectionOptions,
}

export const sentry_dsn =
  'https://016af10b32ed45608bceec9a6f44478b@sentry.io/1757722'
