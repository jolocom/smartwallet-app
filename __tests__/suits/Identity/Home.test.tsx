import React from 'react'
import { useSelector } from 'react-redux'
import Identity from '~/screens/LoggedIn/Identity'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

const mockedNoAttributes = {
  attrs: {
    all: {},
  },
}

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

/* Mocking these components as we are not interested to render it fully
at this stage */
jest.mock('../../../src/screens/LoggedIn/Identity/IdentityIntro', () => () =>
  null,
)
jest.mock(
  '../../../src/screens/LoggedIn/Identity/IdentityCredentials',
  () => () => null,
)
jest.mock(
  '../../../src/screens/LoggedIn/Identity/IdentityBusinessCard',
  () => () => null,
)

/* This test is concerned with testing wether we show intro component
  or self issued credentials on home id tab
*/
describe('Home id tab displays', () => {
  test('intro component when no credentials found in a store', () => {
    // @ts-expect-error
    useSelector.mockImplementationOnce((callback: (state: any) => void) => {
      return callback(mockedNoAttributes)
    })

    const { getByTestId } = renderWithSafeArea(<Identity />)

    expect(getByTestId('home-identity-intro')).toBeDefined()
  })

  xdescribe('self issued credentials', () => {})
})
