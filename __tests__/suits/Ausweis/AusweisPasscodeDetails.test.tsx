import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { AusweisPasscodeDetails } from '~/screens/LoggedIn/eID/components'
import { useGoBack } from '~/hooks/navigation'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { triggerHeaderLayout } from '../components/Collapsible/collapsible-utils'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')

describe('Ausweis passcode details screen', () => {
  const mockHandleDismiss = jest.fn()
  beforeAll(() => {
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn)
    ;(useNavigation as jest.Mock).mockReturnValue({
      dispatch: jest.fn(),
    })
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        onDismiss: mockHandleDismiss,
      },
    })
  })
  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisPasscodeDetails />)
    expect(toJSON()).toMatchSnapshot()
  })
  test('user can choose to proceed with change pin flow', () => {
    const { getByText, getByTestId } = renderWithSafeArea(
      <AusweisPasscodeDetails />,
    )
    triggerHeaderLayout(getByTestId('collapsible-header-container'))
    const changePinBtn = getByText('AusweisPinInfo.btn')
    fireEvent.press(changePinBtn)
    expect(mockHandleDismiss).toHaveBeenCalledTimes(1)
  })
})
