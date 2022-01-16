import React from 'react'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import nfcManager from 'react-native-nfc-manager'
import { Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { usePopStack, useRedirect } from '../../../src/hooks/navigation'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { CompatibilityCheck } from '~/screens/LoggedIn/eID/components/CompatibilityCheck'
import * as eIDHooks from '~/screens/LoggedIn/eID/hooks'
import { AusweisScannerParams } from '~/screens/LoggedIn/eID/types'
import useSettings from '~/hooks/settings'

/**
 * NOTE: since all the settings hook module is mocked,
 * but we still want to have an access to SettingKeys enum
 * we should require actualy enum to bypass the mock of the
 * whole module
 */
const { SettingKeys } = jest.requireActual('../../../src/hooks/settings')

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')
jest.mock('../../../src/hooks/settings')
jest.mock('../../../src/hooks/connection', () => ({
  __esModule: true,
  default: () => ({
    connected: true,
    showDisconnectedToast: jest.fn(),
    showConnectedToast: jest.fn(),
  }),
}))

describe('Ausweis compatibility check screen', () => {
  const mockSettingsSet = jest.fn()
  const mockedNavigationFn = jest.fn()
  const mockRedirect = jest.fn()
  const mockShowScanner = jest.fn()
  let registeredHandlers: Partial<EventHandlers>
  beforeAll(() => {
    ;(useSettings as jest.Mock).mockImplementation(() => ({
      set: mockSettingsSet,
      get: jest.fn(),
    }))
    // mock redux store values that are beng used on the screen
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      ausweis: {
        scannerKey: '123',
      },
    })
    /**
     * NOTE: @react-navigation/native mock
     * should happen at the global level
     */
    // mock @react-navigation/native related properties
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockedNavigationFn,
      dispatch: jest.fn().mockImplementation(),
    })
    /**
     * NOTE: useRedirect and usePopStack hooks should be mocked
     * at the global level
     */
    // mock navigation related hooks (defined in the app)
    ;(useRedirect as jest.Mock).mockReturnValue(mockRedirect)
    ;(usePopStack as jest.Mock).mockReturnValue(jest.fn)
    // mock react-native-nfc-manager used properties
    ;(nfcManager.isSupported as jest.Mock).mockReturnValue(true)
    ;(nfcManager.isEnabled as jest.Mock).mockReturnValue(true)
    ;(nfcManager.start as jest.Mock).mockResolvedValue(true)
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
      scannerParams: {},
    })
  })
  afterEach(() => {
    // these mocks are used in between tests for counting
    // therefore we need to reset count values
    mockShowScanner.mockClear()
    ;(Platform.select as jest.Mock).mockClear()
    ;(aa2Module.startChangePin as jest.Mock).mockClear()
    ;(aa2Module.cancelFlow as jest.Mock).mockClear()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  test('user is able to initiate and complete compatibility check on Android', async () => {
    // since we are testing Android functionality we should choose
    // android implementation
    ;(Platform.select as jest.Mock).mockImplementation((implObj) => {
      implObj['android']()
    })
    const { getByText, findByText } = renderWithSafeArea(<CompatibilityCheck />)
    expect(getByText('AusweisCompatibility.header')).toBeDefined()
    const startBtn = getByText('AusweisCompatibility.checkStart')
    fireEvent.press(startBtn)
    expect(mockShowScanner).toBeCalledTimes(1)
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
    /**
     * Once the "Try again" btn is available
     */
    const tryAgainBtn = await findByText('AusweisCompatibility.checkTryAgain')
    fireEvent.press(tryAgainBtn)
    expect(mockShowScanner).toBeCalledTimes(2)

    /**
     * Immitate receiving READER msg
     * to update compatibility values
     */
    act(() => {
      registeredHandlers!.handleCardInfo!({
        inoperative: false,
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
            inoperative: false,
            deactivated: false,
          }),
        }),
      )
    })
    await findByText('AusweisCompatibility.checkSuccess')
  })
  test('user is able to initiate compatibility check on iOS', async () => {
    ;(Platform.select as jest.Mock).mockImplementation((implObj) => {
      implObj['ios']()
    })
    const { getByText } = renderWithSafeArea(<CompatibilityCheck />)
    expect(getByText('AusweisCompatibility.header')).toBeDefined()
    const startBtn = getByText('AusweisCompatibility.checkStart')
    fireEvent.press(startBtn)

    /**
     * NOTE: since NFC tag isn't read on the background
     * we are eplicitly initiating CHANGE_PIN flow
     * to the READER msg
     */
    expect(mockShowScanner).not.toHaveBeenCalled()
    expect(aa2Module.startChangePin).toHaveBeenCalledTimes(1)
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
      // cancelling CHANGE_PIN flow
      expect(aa2Module.cancelFlow).toHaveBeenCalledTimes(1)
    })
  })

  test('user can choose to skip compatibility', async () => {
    const { getByTestId } = renderWithSafeArea(<CompatibilityCheck />)
    const checkbox = getByTestId('checkbox-option')
    act(() => {
      fireEvent.press(checkbox)
    })
    await waitFor(() => {
      expect(mockSettingsSet).toBeCalledWith(
        SettingKeys.ausweisSkipCompatibility,
        expect.objectContaining({ value: true }),
      )
    })
  })
  test('user can navigate to 6-digit pin instructions screen', () => {
    const { getByText } = renderWithSafeArea(<CompatibilityCheck />)
    const moreInfoBtn = getByText('...AusweisCompatibility.pinBtn')
    fireEvent.press(moreInfoBtn)
    expect(mockRedirect).toBeCalledWith(
      'PasscodeDetails',
      expect.objectContaining({
        onDismiss: expect.any(Function),
      }),
    )
  })
  test('user can proceed with the auth flow', () => {
    const { getByText } = renderWithSafeArea(<CompatibilityCheck />)
    const proceedBtn = getByText('AusweisCompatibility.proceedBtn')
    fireEvent.press(proceedBtn)
    expect(mockRedirect).toBeCalledWith('RequestDetails')
  })
  test('user can cancel the auth flow', () => {
    const { getByText } = renderWithSafeArea(<CompatibilityCheck />)
    const ignoreBtn = getByText('AusweisCompatibility.ignoreBtn')
    fireEvent.press(ignoreBtn)
    expect(aa2Module.cancelFlow).toBeCalledTimes(1)
  })
})
