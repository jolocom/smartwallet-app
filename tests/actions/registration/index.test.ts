import { registrationActions } from 'src/actions'
import data from './data/mockRegistrationData'
import { withErrorScreen } from 'src/actions/modifiers'
import { AppError, ErrorCode } from 'src/lib/errors'
import { routeList } from 'src/routeList'
import { createMockStore, reveal } from 'tests/utils'
import { RootState } from 'src/reducers'

describe('Registration action creators', () => {
  describe('createIdentity', () => {
    const mockMiddleware = {
      createIdentity: jest.fn().mockResolvedValue(data.identityWallet.identity),
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

    beforeEach(mockStore.reset)

    it('should not attempt to create an identity if registration is in progress', async () => {
      const altMockStore = createMockStore({
        registration: {
          loading: {
            isRegistering: true,
          },
        },
      })
      await altMockStore.dispatch(
        registrationActions.createIdentity(data.entropy),
      )
      expect(altMockStore.getActions()).toMatchSnapshot()
    })

    it('should attempt to create an identity', async () => {
      await mockStore.dispatch(registrationActions.createIdentity(data.entropy))

      expect(middlewareStub.createKeyProvider).toHaveBeenCalledWith(
        data.entropy,
      )
      expect(middlewareStub.fuelKeyWithEther).toHaveBeenCalled()
      expect(middlewareStub.createIdentity).toHaveBeenCalled()
      expect(mockStore.getActions()).toMatchSnapshot()
    })

    it('should display exception screen in case of error', async () => {
      mockMiddleware.createIdentity.mockRejectedValueOnce('MockError')
      const asyncAction = registrationActions.createIdentity(data.entropy)

      await mockStore.dispatch(
        withErrorScreen(
          asyncAction,
          err =>
            new AppError(ErrorCode.RegistrationFailed, err, routeList.Landing),
        ),
      )

      expect(mockStore.getActions()).toMatchSnapshot()
    })
  })
})
