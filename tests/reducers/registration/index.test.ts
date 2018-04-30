import { registrationReducer } from 'src/reducers/registration/'

describe('registration reducer', ()=> {
  it('should initialize correctly', () => {
    expect(registrationReducer(undefined, { type: '@INIT' })).toMatchSnapshot()
  })
})
