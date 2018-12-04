import { accountReducer as reducer } from 'src/reducers/account/'
import { accountActions as actions} from 'src/actions/'

describe('account reducer', ()=> {
  it('should handle the DID_SET action ', () => {
    expect(reducer(undefined, actions.setDid('mock did')))
      .toMatchSnapshot()
  })

  it('should initialize correctly', () => {
    expect(reducer(undefined, { type: '@INIT' })).toMatchSnapshot()
  })
})
