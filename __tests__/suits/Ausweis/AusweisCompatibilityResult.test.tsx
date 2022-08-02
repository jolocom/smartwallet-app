import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { useGoBack } from '~/hooks/navigation'
import { AusweisCompatibilityResult } from '~/screens/Modals/Interaction/eID/components'
import { eIDScreens } from '~/screens/Modals/Interaction/eID/types'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')

describe('Ausweis compatibility result screen', () => {
  const mockGoBack = jest.fn()
  describe('is according to the designs when:', () => {
    beforeAll(() => {
      ;(useGoBack as jest.Mock).mockReturnValue(mockGoBack)
    })
    afterEach(() => {
      ;(useRoute as jest.Mock).mockClear()
    })
    afterAll(() => {
      mockGoBack.mockClear()
    })

    test('scanned card is fully supported', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          inoperative: false,
          deactivated: false,
        },
      })
      const { toJSON } = renderWithSafeArea(
        <AusweisCompatibilityResult
          key="123"
          name={eIDScreens.CompatibilityResult}
          params={{
            inoperative: false,
            deactivated: false,
          }}
        />,
      )
      expect(toJSON()).toMatchSnapshot()
    })

    test('scanned card is inopeartive', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          inoperative: true,
          deactivated: false,
        },
      })
      const { toJSON } = renderWithSafeArea(<AusweisCompatibilityResult />)
      expect(toJSON()).toMatchSnapshot()
    })

    test('scanned card is deactivated', () => {
      ;(useRoute as jest.Mock).mockReturnValue({
        params: {
          inoperative: false,
          deactivated: true,
        },
      })
      const { toJSON } = renderWithSafeArea(<AusweisCompatibilityResult />)
      expect(toJSON()).toMatchSnapshot()
    })
  })

  test('can be dismissed', () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        inoperative: false,
        deactivated: false,
      },
    })
    const { getByTestId } = renderWithSafeArea(<AusweisCompatibilityResult />)
    const dismissableArea = getByTestId('dismissable-background')
    fireEvent.press(dismissableArea)
    expect(mockGoBack).toBeCalledTimes(1)
  })
})
