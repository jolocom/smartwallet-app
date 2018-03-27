import { seedPhrase as reducer } from '../../../src/reducers/registration/'
import { registrationActions as actions} from '../../../src/actions/'

describe('registration reducer', ()=> {
  it('should handle the SEEDPHRASE_SET action ', () => {
    expect(reducer(undefined, actions.setSeedPhrase('mock seedPhrase')))
      .toMatchSnapshot()
  })

  it('should handle the SEEDPHRASE_CLEAR action', () => {
    const initialState = 'mock seedPhrase'

    expect(reducer(initialState, actions.clearSeedPhrase()))
      .toMatchSnapshot()
  })

  it('should initialize correctly', () => {
    expect(reducer(undefined, { type: '@INIT' })).toMatchSnapshot()
  })
})
