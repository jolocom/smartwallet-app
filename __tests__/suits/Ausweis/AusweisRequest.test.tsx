import React from 'react'
import { act } from '@testing-library/react-hooks'
import { fireEvent, waitFor } from '@testing-library/react-native'
import nfcManager from 'react-native-nfc-manager'
import { useNavigation } from '@react-navigation/native'
import { aa2Module } from '@jolocom/react-native-ausweis'

import { AusweisFields, eIDScreens } from '~/screens/LoggedIn/eID/types'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { AusweisRequest } from '~/screens/LoggedIn/eID/components'
import { usePopStack } from '~/hooks/navigation'
import useSettings from '~/hooks/settings'
import eIDHooks from '~/screens/LoggedIn/eID/hooks'

const { SettingKeys } = jest.requireActual('../../../src/hooks/settings')
const mockedRequestData = {
  requiredFields: [
    AusweisFields.GivenNames,
    AusweisFields.FamilyName,
    AusweisFields.Address,
  ],
  optionalFields: [AusweisFields.PlaceOfBirth, AusweisFields.Nationality],
  certificateIssuerName: 'IssuerName',
  certificateIssuerUrl: 'IssuerUrl',
  providerName: 'ProviderName',
  providerUrl: 'ProviderUrl',
  providerInfo: 'ProviderInfo',
  effectiveValidityDate: '',
  expirationDate: '',
  setRequest: jest.fn(),
  resetRequest: jest.fn(),
}
const mockOpenUrl = jest.fn()

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')
jest.mock('../../../src/hooks/settings')
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockOpenUrl,
}))
jest.mock('../../../src/hooks/connection', () => ({
  __esModule: true,
  default: () => ({
    connected: true,
    showDisconnectedToast: jest.fn(),
    showConnectedToast: jest.fn(),
  }),
}))

describe('Ausweis review sceen', () => {
  const mockSettingsGet = jest.fn()
  const mockPopStack = jest.fn()
  const mockNavigate = jest.fn()
  beforeAll(() => {
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      ausweis: {
        scannerKey: null,
      },
    })
    ;(nfcManager.isSupported as jest.Mock).mockReturnValue(true)
    ;(nfcManager.isEnabled as jest.Mock).mockReturnValue(true)
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    })
    ;(usePopStack as jest.Mock).mockReturnValue(mockPopStack)
    ;(useSettings as jest.Mock).mockImplementation(() => ({
      set: jest.fn(),
      get: mockSettingsGet,
    }))
    jest.spyOn(eIDHooks, 'useAusweisContext').mockReturnValue(mockedRequestData)
    jest.spyOn(eIDHooks, 'useAusweisCancelBackHandler')
  })
  afterEach(() => {
    mockNavigate.mockClear()
    mockSettingsGet.mockClear()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisRequest />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('user can proceed to the request review screen', async () => {
    mockSettingsGet.mockResolvedValue({ value: true })

    const { getByTestId } = renderWithSafeArea(<AusweisRequest />)
    /**
     * Wait for compatibility properties to be
     * fetched from the storage
     */
    await waitFor(() => {
      expect(mockSettingsGet).toBeCalledTimes(1)
      expect(mockSettingsGet).toBeCalledWith(
        SettingKeys.ausweisSkipCompatibility,
      )
    })

    const requesterLink = getByTestId('ausweis-requester-link')

    /**
     * Pressing provider link
     */
    act(() => {
      fireEvent.press(requesterLink)
    })
    expect(mockOpenUrl).toBeCalledTimes(1)
    expect(mockOpenUrl).toBeCalledWith(mockedRequestData.providerUrl)

    const reviewBtn = getByTestId('ausweis-cta-btn')
    act(() => {
      fireEvent.press(reviewBtn)
    })

    await waitFor(() => {
      /**
       * Note: eralier we mocked skipping the compatibility screen
       */
      expect(mockNavigate).toBeCalledWith(eIDScreens.RequestDetails)
    })
  })
  test('user can proceed to the compatibility check screen', async () => {
    mockSettingsGet.mockResolvedValue({ value: false })

    const { getByTestId } = renderWithSafeArea(<AusweisRequest />)
    /**
     * Wait for compatibility properties to be
     * fetched from the storage
     */
    await waitFor(() => {
      expect(mockSettingsGet).toBeCalledTimes(1)
      expect(mockSettingsGet).toBeCalledWith(
        SettingKeys.ausweisSkipCompatibility,
      )
    })

    const reviewBtn = getByTestId('ausweis-cta-btn')
    act(() => {
      fireEvent.press(reviewBtn)
    })

    await waitFor(() => {
      /**
       * Note: eralier we mocked skipping the compatibility screen
       */
      expect(mockNavigate).toBeCalledWith(eIDScreens.ReadinessCheck)
    })
  })

  test('user can cancel the flow', async () => {
    ;(aa2Module.cancelFlow as jest.Mock).mockRejectedValue('BAD_STATE')
    const { getByTestId } = renderWithSafeArea(<AusweisRequest />)

    await waitFor(() => {
      expect(mockSettingsGet).toBeCalledTimes(1)
    })
    const ignoreBtn = getByTestId('ausweis-ignore-btn')
    act(() => {
      fireEvent.press(ignoreBtn)
    })

    expect(aa2Module.cancelFlow).toHaveBeenCalled()
    expect(mockPopStack).toHaveBeenCalled()
  })
})
