import * as react from 'react'
import * as redux from 'react-redux'
import { act, renderHook } from '@testing-library/react-hooks'
import { InteractionTransportType } from '@jolocom/sdk'

import * as agentHooks from '~/hooks/sdk'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'
import { setInteractionDetails } from '~/modules/interaction/actions'
import { getMappedInteraction } from '~/utils/dataMapping'

import {
  mockedInteractionCredOffer,
  mockedInteractionCredShare,
  mockedInteractionAuth,
  mockedInteractionAuthz,
  mockedNoCredentials,
  mockedHasCredentials,
} from './mockedValues'

export const mockedJWT = 'token'
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
    })
    .mockReturnValueOnce({
      current: {
        interactionManager: {
          start: jest
            .fn()
            .mockImplementationOnce(() =>
              Promise.resolve(mockedInteractionAuth),
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
              Promise.resolve(mockedInteractionAuthz),
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

const arrangeActHook = async () => {
  // ARRANGE
  const { result } = renderHook(() =>
    agentHooks.useInteractionStart(InteractionTransportType.HTTP),
  )
  const { startInteraction } = result.current

  // ACTION
  await act(async () => await startInteraction(mockedJWT))
}

const assertInteractionDetails = (
  mockedInteraction: Record<string, any>,
  dispatchMock: jest.Mock,
) => {
  // @ts-ignore
  const mappedInteraction = getMappedInteraction(mockedInteraction)
  expect(dispatchMock).toHaveBeenCalledWith(
    setInteractionDetails({
      id: mockedInteraction.id,
      flowType: mockedInteraction.flow.type,
      ...mappedInteraction,
    }),
  )
}

const assertLoaderVisibility = (dispatchMock: jest.Mock) => {
  expect(dispatchMock).toHaveBeenCalledWith(
    setLoader({ type: LoaderTypes.default, msg: strings.LOADING }),
  )
}

describe('Correct data was set in the store for ', () => {
  let mockDispatchFn: jest.Mock
  beforeEach(() => {
    mockDispatchFn = getMockedDispatch()
  })
  afterEach(() => {
    //@ts-ignore
    react.useContext.mockClear()
    jest.clearAllMocks()
  })

  it('Credential Offer', async () => {
    await arrangeActHook()

    // ASSERT
    assertLoaderVisibility(mockDispatchFn)
    assertInteractionDetails(mockedInteractionCredOffer, mockDispatchFn)
  })

  describe('Credential Share', () => {
    beforeAll(() => {
      redux.useSelector
        // @ts-ignore
        .mockImplementationOnce((callback: (state: any) => void) => {
          return callback(mockedNoCredentials)
        })
        .mockImplementationOnce((callback: (state: any) => void) => {
          return callback(mockedHasCredentials)
        })
    })
    it('do not start interaction', async () => {
      await arrangeActHook()

      assertLoaderVisibility(mockDispatchFn)

      // @ts-ignore
      const mappedInteraction = getMappedInteraction(mockedInteractionCredShare)

      expect(mockDispatchFn).not.toHaveBeenCalledWith(
        setInteractionDetails({
          id: mockedInteractionCredOffer.id,
          flowType: mockedInteractionCredOffer.flow.type,
          ...mappedInteraction,
        }),
      )

      expect(mockDispatchFn).toHaveBeenCalledWith(dismissLoader())
    })

    it('starts interaction', async () => {
      await arrangeActHook()

      // ASSERT
      assertLoaderVisibility(mockDispatchFn)
      assertInteractionDetails(mockedInteractionCredShare, mockDispatchFn)
    })
  })

  it('Authorization', async () => {
    await arrangeActHook()

    // ASSERT
    assertLoaderVisibility(mockDispatchFn)
    assertInteractionDetails(mockedInteractionAuth, mockDispatchFn)
  })

  it('Authorization', async () => {
    await arrangeActHook()

    // ASSERT
    assertLoaderVisibility(mockDispatchFn)
    assertInteractionDetails(mockedInteractionAuthz, mockDispatchFn)
  })
})
