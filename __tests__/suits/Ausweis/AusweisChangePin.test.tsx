import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { useNavigation } from '@react-navigation/native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { useGoBack, usePopStack } from '~/hooks/navigation'
import AusweisChangePin from '~/screens/Modals/Interaction/eID/components/AusweisChangePin'
import {
  AUSWEIS_SUPPORT_EMAIL,
  AUSWEIS_SUPPORT_PHONE,
} from '~/screens/Modals/Interaction/eID/constants'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import { AusweisScannerParams } from '~/screens/Modals/Interaction/eID/types'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

const mockOpenUrl = jest.fn()
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockOpenUrl,
  canOpenURL: jest.fn().mockResolvedValue(true),
}))

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')
jest.mock('../../../src/hooks/connection', () => ({
  __esModule: true,
  default: () => ({
    connected: true,
    showDisconnectedToast: jest.fn(),
    showConnectedToast: jest.fn(),
  }),
}))

describe('Ausweis change pin screen', () => {
  const mockNavigate = jest.fn()
  const mockShowScanner = jest.fn()
  const goBack = jest.fn()
  const dispatch = jest.fn()
  let registeredHandlers: Partial<EventHandlers>

  beforeAll(() => {
    // mock redux store values that are being used on the screen
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      interaction: {
        ausweis: {
          scannerKey: '123',
        },
        deeplinkConfig: {
          redirectUrl: 'https://jolocom.io/',
        },
      },
    })
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: goBack,
      dispatch: dispatch,
    })
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn)
    ;(usePopStack as jest.Mock).mockReturnValue(jest.fn)
    /**
     * TODO: this is a repetition
     * (declaration of registeredHandlers var)
     * happens in the AusweisPasscode test file as well
     */
    ;(aa2Module.setHandlers as jest.Mock).mockImplementation(handlers => {
      registeredHandlers = handlers
    })
    ;(aa2Module.cancelFlow as jest.Mock).mockResolvedValue(true)

    jest.spyOn(eIDHooks, 'useAusweisScanner').mockReturnValue({
      updateScanner: jest
        .fn()
        .mockImplementation((params: Partial<AusweisScannerParams>) => {
          params.onDone && params.onDone()
        }),
      showScanner: mockShowScanner,
    })
  })

  afterEach(() => {
    mockNavigate.mockClear()
    mockShowScanner.mockClear()
    ;(aa2Module.startChangePin as jest.Mock).mockClear()
  })

  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisChangePin />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('user gets redirected to AusweisTransportWarning screen', async () => {
    const { getByText } = renderWithSafeArea(<AusweisChangePin />)
    const changeTransportPinBtn = getByText('AusweisChangePin.transportPinBtn')
    fireEvent.press(changeTransportPinBtn)
    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith(
        'Interaction',
        expect.objectContaining({
          screen: 'eID',
          params: {
            screen: 'AusweisTransportWarning',
          },
        }),
      )
    })
  })

  test('user cannot proceed with changing 6-digit pin, because card is blocked', async () => {
    const { getByText } = renderWithSafeArea(<AusweisChangePin />)
    const changePinBtn = getByText('AusweisChangePin.pinBtn')
    fireEvent.press(changePinBtn)
    /**
     * Immitate receiving ENTER_PUK msg to update compatibility values
     */
    act(() => {
      registeredHandlers!.handlePukRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        'TransparentModals',
        expect.objectContaining({
          screen: 'AusweisCardInfo',
          params: {
            mode: 'standaloneUnblock',
            onDismiss: expect.any(Function),
          },
        }),
      )
    })
  })

  test('user is able to navigate to email app', async () => {
    const { getByText } = renderWithSafeArea(<AusweisChangePin />)
    const contactLink = getByText(AUSWEIS_SUPPORT_EMAIL)
    fireEvent.press(contactLink)

    await waitFor(() => {
      expect(mockOpenUrl).toHaveBeenCalledTimes(1)
      expect(mockOpenUrl).toHaveBeenCalledWith(
        `mailto:${AUSWEIS_SUPPORT_EMAIL}`,
      )
    })

    mockOpenUrl.mockClear()
  })

  test('user is able to navigate to telephone app', async () => {
    const { getByText } = renderWithSafeArea(<AusweisChangePin />)
    const phoneLink = getByText(new RegExp(AUSWEIS_SUPPORT_PHONE))
    fireEvent.press(phoneLink)

    await waitFor(() => {
      expect(mockOpenUrl).toHaveBeenCalledTimes(1)
      expect(mockOpenUrl).toHaveBeenCalledWith(`tel:${AUSWEIS_SUPPORT_PHONE}`)
    })

    mockOpenUrl.mockClear()
  })
})
