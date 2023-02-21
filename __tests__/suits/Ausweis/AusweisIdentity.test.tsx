import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { useNavigation } from '@react-navigation/native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { useRedirect } from '~/hooks/navigation'
import { AusweisIdentity } from '~/screens/LoggedIn/Identity/AusweisIdentity'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import { AusweisScannerParams } from '~/screens/Modals/Interaction/eID/types'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')
/**
 * TODO mock below as a defualt mock globally
 */
jest.mock('../../../src/hooks/connection', () => ({
  __esModule: true,
  default: () => ({
    connected: true,
    showDisconnectedToast: jest.fn(),
    showConnectedToast: jest.fn(),
  }),
}))

describe('Ausweis identity screen', () => {
  let registeredHandlers: Partial<EventHandlers>
  const mockShowScanner = jest.fn()
  const mockRedirect = jest.fn()
  const mockNavigate = jest.fn()
  const goBack = jest.fn()
  beforeAll(() => {
    /**
     * TODO: this is a repetition
     * (declaration of registeredHandlers var)
     * happens in the AusweisPasscode test file as well
     */
    ;(aa2Module.setHandlers as jest.Mock).mockImplementation(handlers => {
      registeredHandlers = handlers
    })
    ;(aa2Module.cancelFlow as jest.Mock).mockResolvedValue(true)
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: goBack,
    })
    ;(useRedirect as jest.Mock).mockReturnValue(mockRedirect)
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      interaction: {
        ausweis: {
          readerState: null,
        },
        deeplinkConfig: {
          redirectUrl: 'https://jolocom.io/',
        },
      },
    })

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
    mockShowScanner.mockClear()
    mockNavigate.mockClear()
    ;(aa2Module.startChangePin as jest.Mock).mockClear()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })

  test('is disalyed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisIdentity />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('enables user to navigate to AusweisChangePin screen', () => {
    const { getByText } = renderWithSafeArea(<AusweisIdentity />)
    const changePinBtn = getByText('AusweisIdentity.changePinBtn')
    fireEvent.press(changePinBtn)
    expect(mockNavigate).toBeCalledWith('AusweisChangePin')
  })

  test('enables user to try to unblock a card: card is not blocked', async () => {
    const { getByText } = renderWithSafeArea(<AusweisIdentity />)
    const unlockBtn = getByText('AusweisIdentity.unlockBtn')
    fireEvent.press(unlockBtn)
    await waitFor(() => {
      expect(aa2Module.startChangePin).toHaveBeenCalledTimes(1)
    })
    /**
     * Immitate receiving READER msg
     * to update compatibility values
     */
    act(() => {
      registeredHandlers!.handlePinRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('TransparentModals', {
      screen: 'AusweisCardInfo',
      params: {
        mode: 'notBlocked',
        onDismiss: expect.any(Function),
      },
    })
  })

  test('enables user to try to unblock a card: card might be blocked', async () => {
    const { getByText } = renderWithSafeArea(<AusweisIdentity />)
    const unlockBtn = getByText('AusweisIdentity.unlockBtn')
    fireEvent.press(unlockBtn)
    /**
     * Immitate receiving READER msg
     * to update compatibility values
     */

    act(() => {
      registeredHandlers!.handlePukRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('Interaction', {
      screen: 'eID',
      params: expect.objectContaining({
        screen: 'EnterPIN',
        params: expect.objectContaining({
          mode: 'PUK',
          flow: 'unlock',
          handlers: {
            handlePinRequest: expect.any(Function),
          },
        }),
      }),
    })
  })
})
