import { registrationActions } from 'src/actions'
import data from './data/mockRegistrationData'
import { withErrorScreen } from 'src/actions/modifiers'
import { AppError, ErrorCode } from 'src/lib/errors'
import { routeList } from 'src/routeList'
import { createMockStore, reveal } from 'tests/utils'
import { RootState } from 'src/reducers'

describe('Registration action creators', () => {
  describe('submitEntropy', () => {
    const mockMiddleware = {
      keyChainLib: {
        savePassword: jest.fn(),
      },
    }
    const mockStore = createMockStore({}, mockMiddleware)

    beforeEach(mockStore.reset)

    it('should correctly navigate to route and provide the entropy', () => {
      const action = registrationActions.submitEntropy('mockEntropy')
      mockStore.dispatch(action)
      expect(mockStore.getActions()).toMatchSnapshot()
    })
  })

  describe('createIdentity', () => {
    it('should attempt to create an identity', async () => {
      const mockMiddleware = {
        createIdentity: jest
          .fn()
          .mockResolvedValue(data.identityWallet.identity),
      }
      const mockState: Partial<RootState> = {
        registration: {
          loading: {
            loadingMsg: '',
            isRegistering: false,
          },
        },
      }

      const mockStore = createMockStore(mockState, mockMiddleware)
      const middlewareStub = reveal(mockStore.backendMiddleware)

      await mockStore.dispatch(registrationActions.createIdentity(data.entropy))

      expect(middlewareStub.createKeyProvider).toHaveBeenCalledWith(data.entropy)
      expect(middlewareStub.fuelKeyWithEther).toHaveBeenCalled()
      expect(middlewareStub.createIdentity).toHaveBeenCalled()
      expect(mockStore.getActions()).toMatchSnapshot()
    })

    it('should display exception screen in case of error', async () => {
      const mockEntropy = 'abcd'
      const mockMiddleware = {
        keyChainLib: {
          getPassword: jest.fn().mockRejectedValue('MockError'),
        },
      }
      const mockStore = createMockStore({}, mockMiddleware)
      const asyncAction = registrationActions.createIdentity(mockEntropy)

      await mockStore.dispatch(
        withErrorScreen(
          asyncAction,
          err =>
            new AppError(ErrorCode.RegistrationFailed, err, routeList.Landing),
        ),
      )

      const firstAction = mockStore.getActions()[0]
      expect(firstAction.routeName).toContain('Exception')
      expect(firstAction.params.returnTo).toBe('Landing')
    })
  })
})
