import { useRoute } from '@react-navigation/native'
import React from 'react'
import { useGoBack } from '~/hooks/navigation'
import { AusweisCompatibilityResult } from '~/screens/Modals/Interaction/eID/components'
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
      const { toJSON } = renderWithSafeArea(<AusweisCompatibilityResult />)
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
})
