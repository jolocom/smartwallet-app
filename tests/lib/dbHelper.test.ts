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
      path: "m/73'/0'/0",
      entropySource: 1,
      keyType: 'ECDSA secp256k1'
    }

    expect(dbHelper.addDerivedKeyQuery(mockArgs)).toMatchSnapshot()
  }),

  it('should correctly assemble master key addition query', () => {
    expect(dbHelper.addMasterKeyQuery('mockEntropy')).toMatchSnapshot()
  })

  it('should correctly assemble persona addition query', () => {
    expect(dbHelper.addPersonaQuery({
      did: 'mockDid',
      controllingKey: 1
    })).toMatchSnapshot()
  })
})

