import React from 'react'
import { StackActions, useNavigation } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { AusweisPinInfo } from '~/screens/Modals/Interaction/eID/components'
import { useGoBack } from '~/hooks/navigation'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { triggerHeaderLayout } from '../components/Collapsible/collapsible-utils'
import { aa2Module } from '@jolocom/react-native-ausweis'

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
  })

  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisPinInfo />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('user can choose to proceed with change pin flow', async () => {
    const { getByTestId } = renderWithSafeArea(<AusweisPinInfo />)
    triggerHeaderLayout(getByTestId('collapsible-header-container'))
    const changePinBtn = getByTestId('ausweis-pass-info-change-btn')
    fireEvent.press(changePinBtn)

    await waitFor(() => {
      console.log(StackActions.popToTop())
      expect(mockHandleNavigateChangePin).toHaveBeenCalledTimes(2)
      expect(mockHandleNavigateChangePin).toHaveBeenCalledWith({
        type: 'POP_TO_TOP',
      })
      expect(mockHandleNavigateChangePin).toHaveBeenCalledWith({
        payload: { name: 'AusweisChangePin' },
        type: 'REPLACE',
      })
    })
  })
})
