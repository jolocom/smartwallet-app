import React from 'react'
import { useGoBack } from '~/hooks/navigation'
import { AusweisPukInfo } from '~/screens/Modals/Interaction/eID/components'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('../../../src/hooks/navigation')

describe('Ausweis PUK info screen', () => {
  beforeAll(() => {
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn())
  })
  afterAll(() => {
    jest.resetAllMocks()
  })

  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisPukInfo />)
    expect(toJSON()).toMatchSnapshot()
  })
})
