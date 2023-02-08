import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { useNavigation } from '@react-navigation/native'
import { act, fireEvent, waitFor, within } from '@testing-library/react-native'
import React from 'react'
import { AusweisRequestReview } from '~/screens/Modals/Interaction/eID/components'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import {
  AusweisFields,
  AusweisScannerParams,
} from '~/screens/Modals/Interaction/eID/types'
import { usePopStack, useRedirect } from '../../../src/hooks/navigation'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { triggerHeaderLayout } from '../components/Collapsible/collapsible-utils'

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
  effectiveValidityDate: '2016-07-31',
  expirationDate: '2016-08-30',
  setRequest: jest.fn(),
  resetRequest: jest.fn(),
}

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

describe('Ausweis request review screen', () => {
  const mockedNavigation = jest.fn()
  const mockShowScanner = jest.fn()
  let registeredHandlers: Partial<EventHandlers>
  beforeAll(() => {
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockedNavigation,
    })
    jest.spyOn(eIDHooks, 'useAusweisScanner').mockReturnValue({
      updateScanner: jest
        .fn()
        .mockImplementation((params: Partial<AusweisScannerParams>) => {
          params.onDone && params.onDone()
        }),
      showScanner: mockShowScanner,
    })
    jest.spyOn(eIDHooks, 'useAusweisContext').mockReturnValue(mockedRequestData)
    jest
      .spyOn(eIDHooks, 'useAusweisCancelBackHandler')
      .mockReturnValue(undefined)
    ;(aa2Module.setHandlers as jest.Mock).mockImplementation(handlers => {
      registeredHandlers = handlers
    })
    ;(aa2Module.cancelFlow as jest.Mock).mockResolvedValue(true)
    ;(usePopStack as jest.Mock).mockReturnValue(jest.fn())
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      interaction: {
        ausweis: {
          scannerKey: null,
        },
        deeplinkConfig: {
          redirectUrl: 'https://jolocom.io/',
        },
      },
    })
  })
  afterEach(() => {
    mockedNavigation.mockClear()
    mockShowScanner.mockClear()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })

  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisRequestReview />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('user can select optional fields and continue with the flow', async () => {
    const { getAllByTestId, getByTestId } = renderWithSafeArea(
      <AusweisRequestReview />,
    )
    triggerHeaderLayout(getByTestId('collapsible-header-container'))
    const ausweisSections = getAllByTestId('ausweis-list-section')
    /**
     * Optional fields are selectable
     */
    for (const oField of within(ausweisSections[1]).getAllByTestId(
      'selectable-field',
    )) {
      act(() => {
        fireEvent.press(oField)
      })
    }
    const proceedBtn = getByTestId('ausweis-cta-btn')
    act(() => {
      fireEvent.press(proceedBtn)
    })
    await waitFor(() => {
      expect(aa2Module.setAccessRights).toBeCalledWith(
        expect.arrayContaining(['Nationality', 'PlaceOfBirth']),
      )
      expect(aa2Module.acceptAuthRequest).toBeCalledTimes(1)
    })
  })

  test('user chooses to terminate the flow', async () => {
    const { getByTestId } = renderWithSafeArea(<AusweisRequestReview />)
    triggerHeaderLayout(getByTestId('collapsible-header-container'))
    const ignoreBtn = getByTestId('ausweis-ignore-btn')
    act(() => {
      fireEvent.press(ignoreBtn)
    })
    await waitFor(() => {
      expect(aa2Module.cancelFlow).toBeCalledTimes(1)
    })
  })

  test('user chooses to preview more info about the requester', async () => {
    const mockRedirect = jest.fn()
    ;(useRedirect as jest.Mock).mockReturnValue(mockRedirect)
    const { getByText, getByTestId } = renderWithSafeArea(
      <AusweisRequestReview />,
    )
    triggerHeaderLayout(getByTestId('collapsible-header-container'))
    const providerBtn = getByText('AusweisReview.providerBtn')
    act(() => {
      fireEvent.press(providerBtn)
    })
    expect(mockRedirect).toBeCalledWith('AusweisServiceInfo', {
      backgroundColor: '#101010',
      eIdData: {
        title: 'ProviderName',
        fields: expect.arrayContaining([
          expect.objectContaining({
            label: 'AusweisProvider.providerLabel',
            value: 'ProviderName\nProviderUrl',
          }),
          expect.objectContaining({
            label: 'AusweisProvider.certificateLabel',
            value: 'IssuerName\nIssuerUrl',
          }),
          expect.objectContaining({
            label: 'AusweisProvider.providerInfoLabel',
            value: 'ProviderInfo',
          }),
          expect.objectContaining({
            label: 'AusweisProvider.validityLabel',
            value: '31.07.2016 - 30.08.2016',
          }),
        ]),
      },
    })
  })
})
