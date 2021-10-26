import React from 'react'
import Identity from '~/screens/LoggedIn/Identity'
import {
  mockedAttributes,
  mockedNoAttributes,
} from '../../mocks/store/attributes'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'

/* Mocking these components as we are not interested to render it fully
at this stage */
jest.mock(
  '../../../src/screens/LoggedIn/Identity/IdentityIntro',
  () => () => null,
)
jest.mock(
  '../../../src/screens/LoggedIn/Identity/IdentityCredentials',
  () => () => null,
)

/* This test is concerned about testing wether we show intro component
  or self issued credentials on home id tab
*/
describe('Home id tab displays', () => {
  xtest('intro component', () => {
    mockSelectorReturn(mockedNoAttributes)

    const { getByTestId } = renderWithSafeArea(<Identity />)

    expect(getByTestId('home-identity-intro')).toBeDefined()
  })

  test('self issued credentials tab', () => {
    mockSelectorReturn(mockedAttributes)

    const { getByTestId } = renderWithSafeArea(<Identity />)
    expect(getByTestId('home-self-issued-credentials')).toBeDefined()
  })

  test('ausweis identity tab', () => {
    mockSelectorReturn(mockedAttributes)

    const { getByTestId } = renderWithSafeArea(<Identity />)
    expect(getByTestId('home-ausweis-identity')).toBeDefined()
  })
})
