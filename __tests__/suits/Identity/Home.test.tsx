import React from 'react'
import Identity from '~/screens/LoggedIn/Identity'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { mockSelectorReturn } from '../../utils/selector'

const mockedNoAttributes = {
  attrs: {
    all: {},
  },
}

const mockedAttributes = {
  attrs: {
    all: {
      ProofOfEmailCredential: [
        { id: 'claimId', value: { givenName: 'Karl', familyName: 'Muller' } },
      ],
    },
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
  test('intro component', () => {
    mockSelectorReturn(mockedNoAttributes)

    const { getByTestId } = renderWithSafeArea(<Identity />)

    expect(getByTestId('home-identity-intro')).toBeDefined()
  })

  test('self issued credentials', () => {
    mockSelectorReturn(mockedAttributes)

    const { getByTestId } = renderWithSafeArea(<Identity />)
    expect(getByTestId('home-self-issued-credentials')).toBeDefined()
  })
})
