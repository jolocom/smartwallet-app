import { IpfsLib } from 'src/lib/ipfs'

jest.mock('react-native-fetch-blob', () => {
  return {
    default: {
      DocumentDir: () => {},
      polyfill: () => {},
      fetch: jest.fn()
    }
  }
})

describe('Ipfs connector', () => {
  const BASE_URL = 'https://test.com:443'

  let ipfsLib

  beforeEach(() => {
    ipfsLib = new IpfsLib()
    ipfsLib.configure({
      host: 'test.com',
      protocol: 'https',
      port: 443
    })

    ipfsLib.nativeLib.fetch.mockClear()
  })

  it('should be correctly configured', () => {
    expect(ipfsLib.ipfsHost).toBe(BASE_URL)
  })

  it('should correctly attempt to store a JSON document', () => {
    const testJSON = {
      id: 'did:jolo:test',
      publicKeySection: ['first']
    }

    const expectedArgs = [
      'POST',
      'https://test.com:443/api/v0/add?pin=true',
      {'Content-Type': 'multipart/form-data'},
      [{data: JSON.stringify(testJSON), name: 'ddo'}]
    ]

    ipfsLib.storeJSON(testJSON, true)

    expect(ipfsLib.nativeLib.fetch).toHaveBeenCalledTimes(1)
    expect(ipfsLib.nativeLib.fetch).toHaveBeenCalledWith(...expectedArgs)
  })

  it('should correctly attempt to cat JSON document', () => {
    const mockHash = 'mockIpfsHash'
    const expectedArgs = [
      'GET',
      `https://test.com:443/api/v0/cat?arg=${mockHash}`
    ]

    ipfsLib.catJSON(mockHash)
    expect(ipfsLib.nativeLib.fetch).toHaveBeenCalledWith(...expectedArgs)
  })
})
