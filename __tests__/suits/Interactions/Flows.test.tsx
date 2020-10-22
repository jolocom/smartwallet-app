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
const mockedInteraction = {
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

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockReturnValue({
    current: {
      interactionManager: {
        start: jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve(mockedInteraction)),
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

describe('Correct data was set in the store for ', () => {
  it('Credential Offer', async () => {
    // ARRANGE
    const mockDispatchFn = jest.fn()
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

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
    const mappedInteraction = getMappedInteraction(mockedInteraction)

    expect(mockDispatchFn).toHaveBeenCalledWith(
      setInteractionDetails({
        id: mockedInteraction.id,
        flowType: mockedInteraction.flow.type,
        ...mappedInteraction,
      }),
    )
  })
})
