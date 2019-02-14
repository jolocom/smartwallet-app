import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GlobalWithFetchMock } from 'jest-fetch-mock'
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

jest.mock('react-native-fetch-blob', () => {
  return {
    default: {
      DocumentDir: () => {},
      polyfill: () => {},
      fetch: jest.fn()
    }
  }
})

jest.mock('react-native-languages', () => ({
  language: 'en',
  languages: ['en'],
}));
