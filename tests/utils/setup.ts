import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-native-fetch-blob', () => ({
  default: {
    DocumentDir: () => {},
    polyfill: () => {},
    fetch: jest.fn(),
  },
}))

jest.mock('react-native-languages', () => ({
  language: 'en',
  languages: ['en'],
}))
