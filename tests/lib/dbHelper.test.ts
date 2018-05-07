import * as MockDate from 'mockdate'
import { dbHelper } from 'src/lib/dbHelper'
import data from './testData/storageTestData'

describe.only('dbHelper', () => {
  it('should correctly assemble table creation query', () => {
    const { personasTableInfo, keysTableInfo } = data
    expect(dbHelper.createTableQuery(personasTableInfo)).toMatchSnapshot()
    expect(dbHelper.createTableQuery(keysTableInfo)).toMatchSnapshot()
  }),

  it('should correctly assemble derived key addition query', () => {
    const mockArgs = {
      encryptedWif: 'mockWif',
      path: 'm/73\'/0\'/0',
      entropySource: 'mockEncryptedWif',
      keyType: 'ECDSA secp256k1'
    }

    expect(dbHelper.addDerivedKeyQuery(mockArgs)).toMatchSnapshot()
  }),

  it('should correctly assemble master key addition query', () => {
    MockDate.set(765000000000, 0)
    expect(dbHelper.addMasterKeyQuery('mockEntropy')).toMatchSnapshot()
    MockDate.reset()
  })

  it('should correctly assemble persona addition query', () => {
    expect(dbHelper.addPersonaQuery({
      did: 'mockDid',
      controllingKey: 'mockEncryptedWif'
    })).toMatchSnapshot()
  })

  it('should correctly assemble persona retrieval query', () => {
    expect(dbHelper.getPersonasQuery()).toMatchSnapshot()
  })
})

