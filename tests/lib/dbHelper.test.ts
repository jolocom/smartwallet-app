import { dbHelper } from 'src/lib/dbHelper'
import data from './testData/storageTestData'

describe('dbHelper', () => {
  it('should correctly assemble table creation query', () => {
    const { personasTableInfo, keysTableInfo } = data
    expect(dbHelper.assembleCreateTableQuery(personasTableInfo)).toMatchSnapshot()
    expect(dbHelper.assembleCreateTableQuery(keysTableInfo)).toMatchSnapshot()
  }) 
})

