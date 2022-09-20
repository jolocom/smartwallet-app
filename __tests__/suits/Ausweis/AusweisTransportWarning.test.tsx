import { aa2Module } from '@jolocom/react-native-ausweis'
import { useNavigation } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import AusweisTransportWarning from '~/screens/Modals/Interaction/eID/components/AusweisTransportWarning'
import { usePopStack } from '~/hooks/navigation'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

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

describe('Ausweis transport warning screen', () => {
  beforeAll(() => {
    ;(aa2Module.startChangePin as jest.Mock).mockResolvedValue(true)
    ;(usePopStack as jest.Mock).mockReturnValue(jest.fn())
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
    })
  })
  afterAll(() => {
    jest.resetAllMocks()
  })

  test('is displayed according to designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisTransportWarning />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('user can proceed with the change pin flow', () => {
    const { getByText } = renderWithSafeArea(<AusweisTransportWarning />)
    const continueBtn = getByText('RecoveryInfo.closeBtn')
    fireEvent.press(continueBtn)
    expect(aa2Module.startChangePin).toHaveBeenCalledTimes(1)
  })
})
