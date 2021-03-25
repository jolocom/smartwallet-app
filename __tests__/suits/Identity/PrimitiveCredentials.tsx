import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import IdentityCredentials from '~/screens/LoggedIn/Identity/IdentityCredentials'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { mockSelectorReturn } from '../../utils/selector'

const mockedNoAttributes = {
  attrs: {
    all: {},
  },
}

const mockedNavigate = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}))

const getAssertNavigationCall = (fields: ReactTestInstance[]) => {
  let calledTimes = 0
  return (type: AttributeTypes) => {
    fireEvent.press(fields[calledTimes])
    expect(mockedNavigate).toHaveBeenCalledTimes(++calledTimes)
    expect(mockedNavigate).toHaveBeenCalledWith(ScreenNames.CredentialForm, {
      type,
    })
  }
}

describe('Primitive credentials component displays', () => {
  test('placeholders if there are no credentials', () => {
    mockSelectorReturn(mockedNoAttributes)
    const { getByText, getAllByTestId } = renderWithSafeArea(
      <IdentityCredentials />,
    )
    expect(getByText(strings.YOUR_INFO_IS_QUITE_EMPTY)).toBeDefined()

    const emptyFields = getAllByTestId('widget-field-empty')
    expect(emptyFields.length).toBe(4)

    const assertNavigationCall = getAssertNavigationCall(emptyFields)

    assertNavigationCall(AttributeTypes.name)
    assertNavigationCall(AttributeTypes.emailAddress)
    assertNavigationCall(AttributeTypes.mobilePhoneNumber)
    assertNavigationCall(AttributeTypes.postalAddress)
  })
})
