import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import nfcManager from 'react-native-nfc-manager'
import { useNetInfo } from '@react-native-community/netinfo'

import {
  getMockedDispatch,
  mockSelectorReturn,
} from '../../mocks/libs/react-redux'
import { AusweisScannerState } from '~/screens/LoggedIn/eID/types'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { AusweisScanner } from '~/screens/LoggedIn/eID/components'
import { useGoBack } from '~/hooks/navigation'
import * as eIDHooks from '~/screens/LoggedIn/eID/hooks'
import { fireEvent, waitFor } from '@testing-library/react-native'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')

describe('Ausweis scanner screen', () => {
  const mockedNavigate = jest.fn()
  const mockGoBack = jest.fn()
  const mockHandleDone = jest.fn()
  const mockHandleDismiss = jest.fn()
  const mockCheckNfcSupport = jest.fn()
  const mockDispatchFn = getMockedDispatch()
  beforeAll(() => {
    ;(nfcManager.isSupported as jest.Mock).mockReturnValue(true)
    ;(nfcManager.isEnabled as jest.Mock).mockReturnValue(true)
    ;(useNetInfo as jest.Mock).mockReturnValue({
      isConnected: true,
    })
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      ausweis: {
        scannerKey: null,
      },
    })
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockedNavigate,
    })
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        onDone: mockHandleDone,
        state: AusweisScannerState.idle,
        onDismiss: mockHandleDismiss,
      },
    })
    ;(useGoBack as jest.Mock).mockReturnValue(mockGoBack)
    jest.spyOn(eIDHooks, 'useCheckNFC').mockReturnValue({
      checkNfcSupport: mockCheckNfcSupport,
    })
  })
  afterEach(() => {
    mockDispatchFn.mockClear()
    mockCheckNfcSupport.mockClear()
    mockHandleDismiss.mockClear()
    mockHandleDone.mockClear()
    mockGoBack.mockClear()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisScanner />)
    expect(toJSON()).toMatchSnapshot()
  })
  test('scanner key is being dispatch to the store', () => {
    renderWithSafeArea(<AusweisScanner />)
    expect(mockDispatchFn).toHaveBeenCalled()
  })
  test('user can proceed when success animation has finished', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        onDone: mockHandleDone,
        state: AusweisScannerState.success,
        onDismiss: mockHandleDismiss,
      },
    })
    renderWithSafeArea(<AusweisScanner />)
    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(1)
      expect(mockHandleDone).toHaveBeenCalledTimes(1)
    })
  })
  test('user can proceed when failure has occured', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        onDone: mockHandleDone,
        state: AusweisScannerState.failure,
        onDismiss: mockHandleDismiss,
      },
    })
    renderWithSafeArea(<AusweisScanner />)
    await waitFor(() => {
      expect(mockHandleDone).toHaveBeenCalledTimes(1)
    })
  })
  test('user can cancel scanning', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        onDone: mockHandleDone,
        state: AusweisScannerState.idle,
        onDismiss: mockHandleDismiss,
      },
    })
    const { getByText } = renderWithSafeArea(<AusweisScanner />)
    const cancelBtn = getByText('AusweisScanner.cancelBtn')
    fireEvent.press(cancelBtn)
    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(1)
      expect(mockHandleDismiss).toHaveBeenCalledTimes(1)
    })
  })
})
