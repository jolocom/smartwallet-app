import { navigationActions, ssoActions } from '../../../src/actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('Navigation action creators', () => {
  describe('handleDeepLink', () => {
    const jwt = 'bnjksnzjvlrkhgjkndj,fjk32-vfd'

    it('should extract the route name and param from the URL', () => {
      const mockStore = configureStore([thunk])({})
      const parseJWTSpy = jest.spyOn(ssoActions, 'parseJWT')
      const action = navigationActions.handleDeepLink('smartwallet://consent/' + jwt)

      action(mockStore.dispatch)
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(parseJWTSpy).toHaveBeenCalledWith(jwt)
      parseJWTSpy.mockReset()
    })

    it('should not atttempt to parse if route was not correct', () => {
      const mockStore = configureStore([thunk])({})
      const parseJWTSpy = jest.spyOn(ssoActions, 'parseJWT')
      const action = navigationActions.handleDeepLink('smartwallet://somethingElse/' + jwt)

      action(mockStore.dispatch)
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(parseJWTSpy).not.toHaveBeenCalled()
    })
  })
})
