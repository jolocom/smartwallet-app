import { aa2Module } from '@jolocom/react-native-ausweis'
import { useNavigation } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { useGoBack } from '~/hooks/navigation'
import { AusweisPinInfo } from '~/screens/Modals/Interaction/eID/components'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { triggerHeaderLayout } from '../components/Collapsible/collapsible-utils'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')

describe('Ausweis passcode details screen', () => {
  const mockHandleNavigateChangePin = jest.fn()
  ;(aa2Module.cancelFlow as jest.Mock).mockResolvedValue(true)

  beforeAll(() => {
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn)
    ;(useNavigation as jest.Mock).mockReturnValue({
      dispatch: mockHandleNavigateChangePin,
    })
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

  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisPinInfo />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('user can choose to proceed with change pin flow', async () => {
    const { getByText, getByTestId } = renderWithSafeArea(<AusweisPinInfo />)
    triggerHeaderLayout(getByTestId('collapsible-header'))
    const changePinBtn = getByText('AusweisPinInfo.btn')
    fireEvent.press(changePinBtn)

    await waitFor(() => {
      expect(mockHandleNavigateChangePin).toHaveBeenCalledTimes(2)
      expect(mockHandleNavigateChangePin).toHaveBeenCalledWith({
        type: 'POP_TO_TOP',
      })
      expect(mockHandleNavigateChangePin).toHaveBeenCalledWith({
        payload: {
          name: 'Main',
          params: {
            screen: 'AusweisChangePin',
            initial: false,
          },
        },
        type: 'REPLACE',
      })
    })
  })
})
