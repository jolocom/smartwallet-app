import { fireEvent, getQueriesForElement } from '@testing-library/react-native'
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

const mockedEmailAttribute = {
  attrs: {
    all: {
      ProofOfEmailCredential: [
        { id: 'email1', value: { email: 'dev1@jolocom.com' } },
        { id: 'email2', value: { email: 'dev2@jolocom.com' } },
      ],
    },
  },
}

const getAssertNavigationCall = (
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

describe('Primitive credentials component displays', () => {
  beforeEach(() => {
    mockedNavigate.mockClear()
  })

  test('placeholders if there are no credentials', () => {
    mockSelectorReturn(mockedNoAttributes)
    const { getByText, getAllByTestId } = renderWithSafeArea(
      <IdentityCredentials />,
    )
    expect(getByText(strings.YOUR_INFO_IS_QUITE_EMPTY)).toBeDefined()

    const emptyFields = getAllByTestId('widget-field-empty')
    expect(emptyFields.length).toBe(4)

    const assertNavigationCall = getAssertNavigationCall(
      mockedNavigate,
      emptyFields,
    )

    assertNavigationCall(AttributeTypes.name)
    assertNavigationCall(AttributeTypes.emailAddress)
    assertNavigationCall(AttributeTypes.mobilePhoneNumber)
    assertNavigationCall(AttributeTypes.postalAddress)
  })

  test('credential value', () => {
    const {
      attrs: {
        all: { ProofOfEmailCredential },
      },
    } = mockedEmailAttribute
    mockSelectorReturn(mockedEmailAttribute)
    const { getAllByTestId } = renderWithSafeArea(<IdentityCredentials />)

    const widgets = getAllByTestId('widget')
    expect(widgets.length).toBe(4)

    const {
      getByText: getEmailText,
      getAllByTestId: getAllByTestIdEmails,
    } = getQueriesForElement(widgets[0])
    // asserting sorting and values are there
    expect(getEmailText(ProofOfEmailCredential[0].value.email)).toBeDefined()
    expect(getEmailText(ProofOfEmailCredential[1].value.email)).toBeDefined()

    const emailFields = getAllByTestIdEmails('widget-field-static')

    // Part1: (with id) asserting if correct parameters where passed in navigation
    const assertNavigationCall = getAssertNavigationCall(
      mockedNavigate,
      emailFields,
    )
    assertNavigationCall(
      AttributeTypes.emailAddress,
      ProofOfEmailCredential[0].id,
    )
    assertNavigationCall(
      AttributeTypes.emailAddress,
      ProofOfEmailCredential[1].id,
    )

    // Part2: (without id) asserting if correct parameters where passed in navigation
    const { getAllByTestId: getAllByTestIdWithinEmail } = getQueriesForElement(
      widgets[0],
    )
    const addNewOneButtonsEmail = getAllByTestIdWithinEmail('widget-add-new')

    mockedNavigate.mockClear()
    const assertNavigationCallEmail = getAssertNavigationCall(
      mockedNavigate,
      addNewOneButtonsEmail,
    )
    assertNavigationCallEmail(AttributeTypes.emailAddress)
  })
})
