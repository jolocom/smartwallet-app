import { genericActions } from 'src/actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('Generic action creators', () => {
  describe('showErrorScreen', () => {
    it('should navigate to error screen and provide the message', () => {
      const mockStore = configureStore([thunk])({})
      const action = genericActions.showErrorScreen(new Error('test error message'))

      action(mockStore.dispatch)

      expect(mockStore.getActions()).toMatchSnapshot()
    })
  })
})
