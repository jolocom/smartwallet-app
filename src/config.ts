import * as typeOrmConf from '../ormconfig'

// typeorm CLI is not able to connect to the sqlite db on the phone,
// therefore it uses the normal sqlite type
// @ts-ignore
typeOrmConf.type = 'react-native'

export default {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf,
}
