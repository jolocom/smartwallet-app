import {
  registrationReducer as reducer,
  RegistrationState
} from 'src/reducers/registration/'

import { registrationActions as actions} from 'src/actions/'

describe('registration reducer', ()=> {
  it('should initialize correctly', () => {
    expect(reducer(undefined, { type: '@INIT' })).toMatchSnapshot()
  })
})
