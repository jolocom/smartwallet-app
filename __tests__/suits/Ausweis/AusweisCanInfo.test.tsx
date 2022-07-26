import React from 'react'
import { useGoBack } from '~/hooks/navigation'
import { AusweisCanInfo } from '~/screens/LoggedIn/eID/components/AusweisCanInfo'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('../../../src/hooks/navigation')

describe('Ausweis CAN info screen', () => {
  beforeAll(() => {
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn())
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisCanInfo />)
    expect(toJSON()).toMatchSnapshot()
  })
})
