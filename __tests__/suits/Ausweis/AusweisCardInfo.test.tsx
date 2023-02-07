import { useNavigation, useRoute } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { useGoBack } from '~/hooks/navigation'
import AusweisCardInfo from '~/screens/Modals/Interaction/eID/components/AusweisCardInfo'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')

describe('Ausweis card info screen', () => {
  const mockNavigate = jest.fn()
  const mockGoBack = jest.fn()
  beforeAll(() => {
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    })
    ;(useGoBack as jest.Mock).mockReturnValue(mockGoBack)
  })
  afterEach(() => {
    mockNavigate.mockClear()
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  describe('is dsplayed according to the designs', () => {
    test('card in not blocked', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          mode: 'notBlocked',
          onDismiss: jest.fn,
        },
      })

      const { toJSON } = renderWithSafeArea(<AusweisCardInfo />)
      expect(toJSON()).toMatchSnapshot()
    })

    test('card in blocked', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          mode: 'blocked',
          onDismiss: jest.fn,
        },
      })

      const { toJSON } = renderWithSafeArea(<AusweisCardInfo />)
      expect(toJSON()).toMatchSnapshot()
    })

    test('card in unblocked', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          mode: 'unblocked',
          onDismiss: jest.fn,
        },
      })

      const { toJSON } = renderWithSafeArea(<AusweisCardInfo />)
      expect(toJSON()).toMatchSnapshot()
    })

    test('card can be unblocked from identity tab', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          mode: 'standaloneUnblock',
          onDismiss: jest.fn,
        },
      })

      const { toJSON } = renderWithSafeArea(<AusweisCardInfo />)
      expect(toJSON()).toMatchSnapshot()
    })

    test('card can be unblocked from identity tab', () => {
      const mockHandleDismiss = jest.fn()
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          mode: 'standaloneUnblock',
          onDismiss: mockHandleDismiss,
        },
      })

      const { getByTestId } = renderWithSafeArea(<AusweisCardInfo />)
      const identityBtn = getByTestId('identity-screen-link')
      fireEvent.press(identityBtn)
      expect(mockNavigate).toHaveBeenCalledWith('Identity')
      expect(mockHandleDismiss).toHaveBeenCalledTimes(1)
    })

    test('user can close the screen', () => {
      const mockHandleDismiss = jest.fn()
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          mode: 'standaloneUnblock',
          onDismiss: mockHandleDismiss,
        },
      })

      const { getByText } = renderWithSafeArea(<AusweisCardInfo />)
      const closeBtn = getByText('AusweisUnlock.closeBtn')
      fireEvent.press(closeBtn)
      expect(mockHandleDismiss).toHaveBeenCalledTimes(1)
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })
})
