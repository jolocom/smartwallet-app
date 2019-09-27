import typeOrmConf from '../ormconfig'
import { ConnectionOptions } from 'typeorm/browser'

export default {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf as ConnectionOptions,
}
