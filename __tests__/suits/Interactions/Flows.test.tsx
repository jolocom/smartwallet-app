import { act, renderHook } from '@testing-library/react-hooks'
import * as interactionsHooks from '~/hooks/interactions/handlers'
import {
  mockSelectorReturn,
  getMockedDispatch,
} from '../../mocks/libs/react-redux'
import { FlowType } from 'react-native-jolocom'
import { setInteractionDetails } from '~/modules/interaction/actions'

const INTERACTION_NONCE = 'interaction-nonce'
const mockedToken = 'token'
const CREDENTIAL_TYPE = 'First Credential'
const COUNTERPARTY_DID = 'did:123'

jest.mock('../../../src/utils/parseJWT', () => ({
  parseJWT: jest.fn().mockReturnValue(mockedToken),
}))

const mockProcessJWTRequestOffer = jest.fn()

jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    processJWT: mockProcessJWTRequestOffer,
    idw: {
      did: 'did:example',
    },
  }),
}))

jest.mock('../../../src/hooks/toasts', () => ({
  useToasts: () => ({
    scheduleWarning: jest.fn(),
    scheduleErrorWarning: jest.fn(),
  }),
}))

jest.mock('../../../src/hooks/loader', () => ({
  useLoader: jest
    .fn()
    .mockImplementation(
      () =>
        async (cb: () => Promise<void>, _: object, onSuccess: () => void) => {
          await cb()
          onSuccess()
        },
    ),
}))

const arrangeActHook = async () => {
  // ARRANGE
  const { result } = renderHook(() => interactionsHooks.useInteractionStart())

  const { startInteraction } = result.current

  // ACTION
  await act(async () => {
    await startInteraction(mockedToken)
  })
}

describe('Correct data was set in the store for ', () => {
  let mockDispatchFn: jest.Mock
  beforeEach(() => {
    mockDispatchFn = getMockedDispatch()
  })

  it('Credential Offer', async () => {
    mockSelectorReturn({
      account: {
        did: 'did:user:1',
      },
    })
    mockProcessJWTRequestOffer.mockReturnValue({
      id: INTERACTION_NONCE,
      flow: {
        type: FlowType.CredentialOffer,
      },
      getSummary: jest.fn().mockReturnValue({
        initiator: {
          did: COUNTERPARTY_DID,
        },
        state: {
          offerSummary: [
            {
              type: CREDENTIAL_TYPE,
              renderInfo: {},
            },
          ],
        },
      }),
    })
    await arrangeActHook()

    // ASSERT
    expect(mockDispatchFn).toHaveBeenCalledWith(
      setInteractionDetails({
        id: INTERACTION_NONCE,
        flowType: FlowType.CredentialOffer,
        counterparty: {
          did: COUNTERPARTY_DID,
        },
        credentials: {
          // eslint-disable-next-line
          service_issued: [
            {
              type: CREDENTIAL_TYPE,
              category: 'other',
              invalid: false,
              name: '',
              properties: [],
            },
          ],
        },
      }),
    )
  })
})
