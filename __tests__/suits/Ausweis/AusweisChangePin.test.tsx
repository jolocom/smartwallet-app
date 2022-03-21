import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import AusweisChangePin from '~/screens/LoggedIn/eID/components/AusweisChangePin'
import { AusweisScannerParams } from '~/screens/LoggedIn/eID/types'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import eIDHooks from '~/screens/LoggedIn/eID/hooks'
import { useGoBack, usePopStack } from '~/hooks/navigation'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'

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
  let registeredHandlers: Partial<EventHandlers>
  beforeAll(() => {
    // mock redux store values that are beng used on the screen
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      ausweis: {
        scannerKey: '123',
      },
    })
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
      dispatch: jest.fn(),
    })
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn)
    ;(usePopStack as jest.Mock).mockReturnValue(jest.fn)
    /**
     * TODO: this is a repetition
     * (declaration of registeredHandlers var)
     * happens in the AusweisPasscode test file as well
     */
    ;(aa2Module.setHandlers as jest.Mock).mockImplementation((handlers) => {
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
  test('user can proceed with changing transport pin', async () => {
    const { getByText } = renderWithSafeArea(<AusweisChangePin />)
    const changeTransportPinBtn = getByText('AusweisChangePin.transportPinBtn')
    fireEvent.press(changeTransportPinBtn)
    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith(
        'eID',
        expect.objectContaining({
          screen: 'AusweisTransportWarning',
        }),
      )
    })
    /**
     * Immitate receiving INSERT_CARD msg
     * to update compatibility values
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    expect(mockShowScanner).toHaveBeenCalledTimes(1)
  })
  test('user can proceed with changing 6-digit pin', async () => {
    const { getByText } = renderWithSafeArea(<AusweisChangePin />)
    const changePinBtn = getByText('AusweisChangePin.pinBtn')
    fireEvent.press(changePinBtn)
    await waitFor(() => {
      expect(aa2Module.startChangePin).toHaveBeenCalledTimes(1)
      /**
       * Immitate receiving INSERT_CARD msg
       * to update compatibility values
       */
    })
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })

    await waitFor(() => {
      expect(mockShowScanner).toHaveBeenCalledTimes(1)
    })
    /**
     * Immitate receiving ENTER_PIN msg
     * to update compatibility values
     */
    act(() => {
      registeredHandlers!.handlePinRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        'eID',
        expect.objectContaining({
          screen: 'EnterPIN',
          params: {
            flow: 'changePin',
            mode: 'PIN',
            pinContext: undefined,
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
})
