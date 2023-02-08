import React from 'react'
import { AusweisPukInfo } from '~/screens/Modals/Interaction/eID/components'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('../../../src/hooks/navigation')

describe('Ausweis PUK info screen', () => {
  afterAll(() => {
    jest.resetAllMocks()
    jest.useFakeTimers()
  })

  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisPukInfo />)
    expect(toJSON()).toMatchSnapshot()
  })
})
