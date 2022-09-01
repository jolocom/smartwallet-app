import { fireEvent, getQueriesForElement } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import IdentityCredentials from '~/screens/LoggedIn/Identity/IdentityCredentials'
import { AttributeTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import {
  getMockedEmailAttribute,
  mockedNoAttributes,
} from '../../mocks/store/attributes'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'

const ATTRIBUTE_ID_1 = 'claim:id-1'
const ATTRIBUTE_ID_2 = 'claim:id-2'
const EMAIL_VALUE_1 = 'dev-1@jolocom.com'
const EMAIL_VALUE_2 = 'dev-2@jolocom.com'

const mockedNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}))

jest.mock('../../../src/hooks/attributes', () => ({
  useSICActions: () => ({
    handleDeleteCredentialsSI: jest.fn(),
  }),
}))

const pressFieldAndAssertNavigation = (
  mockedNavigate: jest.Mock,
  fields: ReactTestInstance[],
) => {
  let calledTimes = 0
  return (type: AttributeTypes, id?: string) => {
    fireEvent.press(fields[calledTimes])
    expect(mockedNavigate).toHaveBeenCalledTimes(++calledTimes)
    expect(mockedNavigate).toHaveBeenCalledWith(ScreenNames.CredentialForm, {
      type,
      ...(id && { id }),
    })
  }
}

describe('Primitive credentials component displays', () => {
  beforeEach(() => {
    mockedNavigate.mockClear()
  })

  test('placeholders if there are no credentials', () => {
    mockSelectorReturn(mockedNoAttributes)
    const { getByText, getAllByTestId } = renderWithSafeArea(
      <IdentityCredentials />,
    )
    expect(getByText(/Identity.credentialsDescription/)).toBeDefined()

    const emptyFields = getAllByTestId('widget-field-empty')
    expect(emptyFields.length).toBe(4)

    const clickAndAssertNavigationCall = pressFieldAndAssertNavigation(
      mockedNavigate,
      emptyFields,
    )

    clickAndAssertNavigationCall(AttributeTypes.name)
    clickAndAssertNavigationCall(AttributeTypes.emailAddress)
    clickAndAssertNavigationCall(AttributeTypes.mobilePhoneNumber)
    clickAndAssertNavigationCall(AttributeTypes.postalAddress)
  })

  test('fields are rendered', () => {
    const mockedStoreEmailAttribute = getMockedEmailAttribute(
      ATTRIBUTE_ID_1,
      ATTRIBUTE_ID_2,
      EMAIL_VALUE_1,
      EMAIL_VALUE_2,
    )
    mockSelectorReturn(mockedStoreEmailAttribute)

    const { getAllByTestId } = renderWithSafeArea(<IdentityCredentials />)

    expect(getAllByTestId('widget-field-static')).toHaveLength(2)
  })

  test('adding on press create new', () => {
    const mockedStoreEmailAttribute = getMockedEmailAttribute(
      ATTRIBUTE_ID_1,
      ATTRIBUTE_ID_2,
      EMAIL_VALUE_1,
      EMAIL_VALUE_2,
    )
    mockSelectorReturn(mockedStoreEmailAttribute)
    const { getByTestId } = renderWithSafeArea(<IdentityCredentials />)

    const { getAllByTestId } = getQueriesForElement(
      getByTestId('id-widget-with-values'),
    )

    // Part2: (without id) asserting if correct parameters where passed in navigation
    const addNewOneButtonsEmail = getAllByTestId('widget-add-new')

    mockedNavigate.mockClear()
    const clickAndAssertNavigationCallEmail = pressFieldAndAssertNavigation(
      mockedNavigate,
      addNewOneButtonsEmail,
    )
    clickAndAssertNavigationCallEmail(AttributeTypes.emailAddress)
  })

  test('navigating on press', () => {
    const mockedStoreEmailAttribute = getMockedEmailAttribute(
      ATTRIBUTE_ID_1,
      ATTRIBUTE_ID_2,
      EMAIL_VALUE_1,
      EMAIL_VALUE_2,
    )
    const {
      attrs: {
        all: { ProofOfEmailCredential },
      },
    } = mockedStoreEmailAttribute
    mockSelectorReturn(mockedStoreEmailAttribute)
    const { getAllByTestId } = renderWithSafeArea(<IdentityCredentials />)

    const emailFields = getAllByTestId('widget-field-static')

    // Part1: (with id) asserting if correct parameters where passed in navigation
    const clickAndAssertNavigationCall = pressFieldAndAssertNavigation(
      mockedNavigate,
      emailFields,
    )
    clickAndAssertNavigationCall(
      AttributeTypes.emailAddress,
      ProofOfEmailCredential[0].id,
    )
    clickAndAssertNavigationCall(
      AttributeTypes.emailAddress,
      ProofOfEmailCredential[1].id,
    )
  })
})
