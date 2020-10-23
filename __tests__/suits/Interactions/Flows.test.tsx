import * as redux from 'react-redux'
import { act, renderHook } from '@testing-library/react-hooks'
import { FlowType, InteractionTransportType } from '@jolocom/sdk'

import * as agentHooks from '~/hooks/sdk'
import { setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'
import { setInteractionDetails } from '~/modules/interaction/actions'
import { getMappedInteraction } from '~/utils/dataMapping'

const mockedJWT = 'token'
const mockedInteractionCredOffer = {
  id: '123',
  flow: {
    type: FlowType.CredentialOffer,
  },
  getSummary: jest.fn().mockReturnValue({
    initiator: {
      did: 'did123',
    },
    state: {
      offerSummary: [
        {
          type: 'FirstCredentia',
          renderInfo: {},
        },
      ],
    },
  }),
}

const mockedInteractionCredShare = {
  id: '123',
  flow: {
    type: FlowType.CredentialOffer,
  },
  getSummary: jest.fn().mockReturnValue({
    initiator: {
      did: 'did123',
    },
    state: {
      // constraints: [
      //   {requestedCredentialTypes}
      // ]
    },
  }),
}

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest
    .fn()
    .mockReturnValueOnce({
      current: {
        interactionManager: {
          start: jest
            .fn()
            .mockImplementationOnce(() =>
              Promise.resolve(mockedInteractionCredOffer),
            ),
        },
      },
    })
    .mockReturnValueOnce({
      current: {
        interactionManager: {
          start: jest
            .fn()
            .mockImplementationOnce(() =>
              Promise.resolve(mockedInteractionCredShare),
            ),
        },
      },
    }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValueOnce(['0', '1', '2']),
}))

jest.mock('../../../src/utils/parseJWT', () => ({
  parseJWT: jest.fn().mockReturnValue(mockedJWT),
}))

const getMockedDispatch = () => {
  const mockDispatchFn = jest.fn()
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(mockDispatchFn)
  return mockDispatchFn
}

describe('Correct data was set in the store for ', () => {
  let mockDispatchFn: jest.Mock
  beforeEach(() => {
    mockDispatchFn = getMockedDispatch()
  })
  afterEach(jest.clearAllMocks)

  it('Credential Offer', async () => {
    const { result } = renderHook(() =>
      agentHooks.useInteractionStart(InteractionTransportType.HTTP),
    )
    const { startInteraction } = result.current

    // ACTION
    await act(async () => await startInteraction(mockedJWT))

    // ASSERT
    expect(mockDispatchFn).toHaveBeenCalledWith(
      setLoader({ type: LoaderTypes.default, msg: strings.LOADING }),
    )

    // @ts-ignore
    const mappedInteraction = getMappedInteraction(mockedInteractionCredOffer)

    expect(mockDispatchFn).toHaveBeenCalledWith(
      setInteractionDetails({
        id: mockedInteractionCredOffer.id,
        flowType: mockedInteractionCredOffer.flow.type,
        ...mappedInteraction,
      }),
    )
  })

  it('Credential Share', async () => {
    const { result } = renderHook(() =>
      agentHooks.useInteractionStart(InteractionTransportType.HTTP),
    )
    const { startInteraction } = result.current

    // ACTION
    await act(async () => await startInteraction(mockedJWT))

    expect(mockDispatchFn).toHaveBeenCalledWith(
      setLoader({ type: LoaderTypes.default, msg: strings.LOADING }),
    )
  })
})
