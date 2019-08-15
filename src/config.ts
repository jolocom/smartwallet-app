// @ts-ignore
import * as typeOrmConf from '../ormconfig'
import { Initial1565886000404 } from './lib/storage/migration/1565886000404-initial'
import {
  CacheEntity,
  CredentialEntity,
  MasterKeyEntity,
  PersonaEntity,
  SettingEntity,
  SignatureEntity,
  VerifiableCredentialEntity,
} from './lib/storage/entities'
typeOrmConf.migrations = [Initial1565886000404]
typeOrmConf.entities = [
  CacheEntity,
  CredentialEntity,
  MasterKeyEntity,
  PersonaEntity,
  SettingEntity,
  SignatureEntity,
  VerifiableCredentialEntity,
]
export default {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf,
}
