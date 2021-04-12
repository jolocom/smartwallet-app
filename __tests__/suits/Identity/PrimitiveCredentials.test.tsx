import { fireEvent, getQueriesForElement } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import IdentityCredentials from '~/screens/LoggedIn/Identity/IdentityCredentials'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { mockSelectorReturn } from '../../utils/selector'

const ATTRIBUTE_ID_1 = 'claim:id-1'
const ATTRIBUTE_ID_2 = 'claim:id-2'
const EMAIL_VALUE_1 = 'dev-1@jolocom.com'
const EMAIL_VALUE_2 = 'dev-2@jolocom.com'

const mockedStoreNoAttributes = {
  attrs: {
    all: {},
  },
}

const mockedStoreEmailAttribute = {
  attrs: {
    all: {
      ProofOfEmailCredential: [
        { id: ATTRIBUTE_ID_1, value: { email: EMAIL_VALUE_1 } },
        { id: ATTRIBUTE_ID_2, value: { email: EMAIL_VALUE_2 } },
      ],
    },
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
    mockSelectorReturn(mockedStoreNoAttributes)
    const { getByText, getAllByTestId } = renderWithSafeArea(
      <IdentityCredentials />,
    )
    expect(getByText(strings.YOUR_INFO_IS_QUITE_EMPTY)).toBeDefined()

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

  test('credential values', () => {
    const {
      attrs: {
        all: { ProofOfEmailCredential },
      },
    } = mockedStoreEmailAttribute
    mockSelectorReturn(mockedStoreEmailAttribute)
    const { getAllByTestId } = renderWithSafeArea(<IdentityCredentials />)

    const widgets = getAllByTestId('widget')
    expect(widgets.length).toBe(4)

    const {
      getByText: getByTextEmailWidget,
      getAllByTestId: getAllByTestIdEmailWidget,
    } = getQueriesForElement(widgets[0])
    // asserting sorting and values are there
    expect(
      getByTextEmailWidget(ProofOfEmailCredential[0].value.email),
    ).toBeDefined()
    expect(
      getByTextEmailWidget(ProofOfEmailCredential[1].value.email),
    ).toBeDefined()

    const emailFields = getAllByTestIdEmailWidget('widget-field-static')

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

    // Part2: (without id) asserting if correct parameters where passed in navigation
    const addNewOneButtonsEmail = getAllByTestIdEmailWidget('widget-add-new')

    mockedNavigate.mockClear()
    const clickAndAssertNavigationCallEmail = pressFieldAndAssertNavigation(
      mockedNavigate,
      addNewOneButtonsEmail,
    )
    clickAndAssertNavigationCallEmail(AttributeTypes.emailAddress)
  })
})
