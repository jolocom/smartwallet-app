import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { useNavigation } from '@react-navigation/native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Platform } from 'react-native'

import eIDHooks from '../../../src/screens/LoggedIn/eID/hooks'
import { AusweisIdentity } from '~/screens/LoggedIn/Identity/AusweisIdentity'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { AusweisScannerParams } from '~/screens/LoggedIn/eID/types'
import { useRedirect } from '~/hooks/navigation'

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
  beforeAll(() => {
    /**
     * TODO: this is a repetition
     * (declaration of registeredHandlers var)
     * happens in the AusweisPasscode test file as well
     */
    ;(aa2Module.setHandlers as jest.Mock).mockImplementation((handlers) => {
      registeredHandlers = handlers
    })
    ;(aa2Module.cancelFlow as jest.Mock).mockResolvedValue(true)
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
    })
    ;(useRedirect as jest.Mock).mockReturnValue(mockRedirect)

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
  test('enables user to run compatibility check on Android', async () => {
    ;(Platform.select as jest.Mock).mockImplementation((implObj) => {
      implObj['android']()
    })
    const { getByText } = renderWithSafeArea(<AusweisIdentity />)
    const compatibilityCheckBtn = getByText('AusweisIdentity.compatibilityBtn')
    fireEvent.press(compatibilityCheckBtn)
    await waitFor(() => {
      expect(mockShowScanner).toBeCalledTimes(1)
    })
    /**
     * Immitate receiving READER msg
     * to update compatibility values
     */
    act(() => {
      registeredHandlers!.handleCardInfo!({
        inoperative: true,
        deactivated: false,
        retryCounter: 1,
      })
    })
    await waitFor(() => {
      // cancelling only happens on iOS
      //expect(aa2Module.cancelFlow).toHaveBeenCalledTimes(1)
      expect(mockRedirect).toBeCalledWith(
        'eID',
        expect.objectContaining({
          screen: 'CompatibilityResult',
          params: expect.objectContaining({
            inoperative: true,
            deactivated: false,
          }),
        }),
      )
    })
  })
  test('enables user to run compatibility check on iOS', async () => {
    ;(Platform.select as jest.Mock).mockImplementation((implObj) => {
      implObj['ios']()
    })
    const { getByText } = renderWithSafeArea(<AusweisIdentity />)
    const compatibilityCheckBtn = getByText('AusweisIdentity.compatibilityBtn')
    fireEvent.press(compatibilityCheckBtn)
    await waitFor(() => {
      expect(aa2Module.startChangePin).toHaveBeenCalledTimes(1)
      expect(mockShowScanner).not.toBeCalled()
    })
    /**
     * Immitate receiving READER msg
     * to update compatibility values
     */
    act(() => {
      registeredHandlers!.handleCardInfo!({
        inoperative: true,
        deactivated: false,
        retryCounter: 1,
      })
    })
    await waitFor(() => {
      expect(aa2Module.cancelFlow).toHaveBeenCalledTimes(1)
      expect(mockRedirect).toBeCalledWith(
        'eID',
        expect.objectContaining({
          screen: 'CompatibilityResult',
          params: expect.objectContaining({
            inoperative: true,
            deactivated: false,
          }),
        }),
      )
    })
  })
  test('enables user to navigate to change pin', () => {
    const { getByText } = renderWithSafeArea(<AusweisIdentity />)
    const changePinBtn = getByText('AusweisIdentity.changePinBtn')
    fireEvent.press(changePinBtn)
    expect(mockNavigate).toBeCalledWith(
      'eID',
      expect.objectContaining({
        screen: 'AusweisChangePin',
      }),
    )
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
    expect(mockNavigate).toHaveBeenCalledWith('eID', {
      screen: 'EnterPIN',
      params: {
        mode: 'PUK',
        flow: 'unlock',
        handlers: {
          handlePinRequest: expect.any(Function),
        },
      },
    })
  })
})
