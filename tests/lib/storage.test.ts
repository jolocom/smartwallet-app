import { groupAttributesByCredentialId } from '../../src/lib/storage/utils'
import {
  CredentialEntity,
  VerifiableCredentialEntity,
} from '../../src/lib/storage/entities'

describe('lib/storage', () => {
  jest.unmock('src/lib/storage/storage')
  jest.mock('src/lib/storage/entities', () => ({}))
  jest.mock('typeorm/browser', () => {
    return {
      createConnection: jest.fn().mockResolvedValue({}),
    }
  })

  describe('Storage', () => {
    const Storage = require('src/lib/storage/storage').Storage
    const config = {}

    describe('initConnection', () => {
      const createConnection: jest.Mock = require('typeorm/browser')
        .createConnection

      it('should create only one connection if called multiple times synchronously', async () => {
        createConnection.mockClear()

        const storage = new Storage(config)
        storage.initConnection()
        await storage.initConnection()

        expect(createConnection).toHaveBeenCalledTimes(1)
      })

      it('should create a new connection if last try failed', async () => {
        const storage = new Storage(config)
        createConnection.mockClear()
        createConnection.mockRejectedValueOnce(false)

        // sync calls will only create connection once
        storage.initConnection()
        storage.initConnection()

        try {
          // this should not attempt to createConnection, but rather return the
          // previous promise, which is mocked to be rejected
          await storage.initConnection()
        } catch (err) {
          // this should call createConnection again
          await storage.initConnection()
        }
        expect(createConnection).toHaveBeenCalledTimes(2)
      })
    })
    describe('Helper functions', () => {
      it('Should correctly group credentials by credential id', () => {
        const mockCredential: CredentialEntity[] = [
          {
            propertyName: 'email',
            propertyValue: 'test@example.com',
            id: 5,
            verifiableCredential: {
              id: '01',
            } as VerifiableCredentialEntity,
          },
          {
            id: 6,
            propertyName: 'givenName',
            propertyValue: 'Mark',
            verifiableCredential: {
              id: '02',
            } as VerifiableCredentialEntity,
          },
          {
            id: 7,
            propertyName: 'familyName',
            propertyValue: 'Mustermann',
            verifiableCredential: {
              id: '02',
            } as VerifiableCredentialEntity,
          },
        ]

        expect(groupAttributesByCredentialId(mockCredential)).toStrictEqual([
          {
            propertyName: 'email',
            propertyValue: ['test@example.com'],
            id: 5,
            verifiableCredential: { id: '01' },
          },
          {
            id: 6,
            propertyName: 'givenName',
            propertyValue: ['Mark', 'Mustermann'],
            verifiableCredential: { id: '02' },
          },
        ])
      })
    })
  })
})
