import * as MockDate from 'mockdate'
import { Storage }  from 'src/lib/storage'

describe('Storage lib', () => {

  describe('abstractions around the library', () => {
    it('should open / provide a db instance with foreign key enforcement', async () => {
      const mockOpenDb = jest.fn((dbOptions, successCB, errorCB) => {
        successCB(mockDbInstance)
      })

      const mockDbInstance = {
        executeSql: jest.fn((query, params, successCB, errorCB) => {
          successCB()
        })
      }

      const storageAgent = new Storage()
      storageAgent.sqlLite.openDatabase = mockOpenDb
      await storageAgent.getDbInstance()

      expect(mockDbInstance.executeSql.mock.calls).toMatchSnapshot()
      expect(mockOpenDb.mock.calls).toMatchSnapshot()
    }) 

    it('should attempt to close a db instance', async () => {
      const mockDb = {
        close: jest.fn((successCB, errorCB) => {
          successCB()
        })
      }
      
      const storageAgent = new Storage()
      await storageAgent.closeDB(mockDb)
      expect(mockDb.close).toHaveBeenCalledTimes(1)
    })

    it('should attempt to execute a write query', async () => {
      const mockTransaction = {
        executeSql: jest.fn()
      }

      const mockDb = {
        transaction: jest.fn((toExecute, errorCB, successCB) => {
          toExecute(mockTransaction)
          successCB()
        })
      }

      const mockQuery = {
        text: 'INSERT into MOCK VALUES(?)',
        values: ['mockValue']
      }

      const storageAgent = new Storage()
      await storageAgent.executeWriteTransaction(mockDb, mockQuery)
      expect(mockTransaction.executeSql.mock.calls).toMatchSnapshot()
      expect(mockDb.transaction).toHaveBeenCalledTimes(1)
    })

    it('should attempt to execute a read query', async () => {
      const storageAgent = new Storage()

      const mockResult = { rows: { raw: jest.fn() } }
      const mockQuery = { text: 'SELECT * FROM Mock', values: [] }

      const mockDb = {
        readTransaction: jest.fn((toExecute, errorCB, successCB) => {
          toExecute(mockTransaction)
        })
      }

      const mockTransaction = {
        executeSql: jest.fn((text, values, successCB, errorCB) => {
          successCB({}, mockResult)
        })
      }


      expect(await storageAgent.executeReadTransaction(mockDb, mockQuery)).toBe(mockResult.rows)
      expect(mockTransaction.executeSql.mock.calls).toMatchSnapshot()
      expect(mockDb.readTransaction).toHaveBeenCalledTimes(1)
    })
  })

  describe('writing data to the database', () => {
    const storageAgent = new Storage()
    const mockDb = {
      transaction: jest.fn()
    }

    beforeEach(() => {
      storageAgent.closeDB = jest.fn()
      storageAgent.executeWriteTransaction = jest.fn()
      storageAgent.getDbInstance = jest.fn().mockResolvedValue(mockDb)
    })

    it('should attempt to create the db tables', async () => {
      await storageAgent.provisionTables()
      expect(storageAgent.executeWriteTransaction.mock.calls).toMatchSnapshot()
      expect(storageAgent.getDbInstance).toHaveBeenCalledTimes(1)
      expect(storageAgent.closeDB).toHaveBeenCalledTimes(1)
    })

    it('should attempt to add a persona', async () => {
      await storageAgent.addPersona({
        did: 'did:jolo:mock',
        controllingKey: 'mockEncryptedWif'
      })

      expect(storageAgent.executeWriteTransaction.mock.calls).toMatchSnapshot()
      expect(storageAgent.getDbInstance).toHaveBeenCalledTimes(1)
      expect(storageAgent.closeDB).toHaveBeenCalledTimes(1)
    })

    it('should attempt to add a master key', async () => {
      MockDate.set(new Date(765000000000), 0)
      await storageAgent.addMasterKey('mockEntropy')

      expect(storageAgent.executeWriteTransaction.mock.calls).toMatchSnapshot()
      expect(storageAgent.getDbInstance).toHaveBeenCalledTimes(1)
      expect(storageAgent.closeDB).toHaveBeenCalledTimes(1)
      MockDate.reset()
    })

    it('should attempt to add a derived key', async () => {
      await storageAgent.addDerivedKey({
        encryptedWif: 'mockWif',
        path: "m/0/3'/0",
        entropySource: 'encEntropy',
        keyType: 'ECDSA'
      })

      expect(storageAgent.executeWriteTransaction.mock.calls).toMatchSnapshot()
      expect(storageAgent.getDbInstance).toHaveBeenCalledTimes(1)
      expect(storageAgent.closeDB).toHaveBeenCalledTimes(1)
    })
  })

  describe('reading from the database', () => {
    it('should attempt to get all personas', async () => {
      const mockPersonas: ['did:jolo:first', 'did:jolo:second']
      const mockDb = { transaction: jest.fn() }
      const mockRes = { raw: () => mockPersonas }

      const storageAgent = new Storage()
      storageAgent.getDbInstance = jest.fn().mockResolvedValue(mockDb)
      storageAgent.executeReadTransaction = jest.fn().mockResolvedValue(mockRes)
      storageAgent.closeDB = jest.fn()

      expect(await storageAgent.getPersonas()).toBe(mockPersonas)
      expect(storageAgent.getDbInstance).toHaveBeenCalledTimes(1)
      expect(storageAgent.executeReadTransaction.mock.calls).toMatchSnapshot()
      expect(storageAgent.closeDB).toHaveBeenCalledTimes(1)
    })

  })
})
