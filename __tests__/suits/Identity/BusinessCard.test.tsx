import React from 'react'

import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import IdentityBusinessCard from '~/screens/LoggedIn/Identity/IdentityBusinessCard'
import { strings } from '~/translations'
import {
  fireEvent,
  getQueriesForElement,
  waitFor,
} from '@testing-library/react-native'
import { ScreenNames } from '~/types/screens'
import { mockSelectorReturn } from '../../utils/selector'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { ReactTestInstance } from 'react-test-renderer'
import { getMockedDispatch } from '../../utils/dispatch'
import { deleteAttr } from '~/modules/attributes/actions'

const ATTRIBUTE_ID = 'claim:businesscard:id'
const ATTRIBUTE_TYPE = AttributeTypes.businessCard
const GIVEN_NAME = 'Karl'
const FAMILY_NAME = 'Muller'
const EMAIL_VALUE = 'dev@example.com'
const COMPANY_NAME = 'SmartWallet'

const mockedStore = {
  account: {
    did: 'did-1',
  },
  attrs: {
    all: {
      [ATTRIBUTE_TYPE]: [
        {
          id: ATTRIBUTE_ID,
          value: {
            [ClaimKeys.givenName]: GIVEN_NAME,
            [ClaimKeys.familyName]: FAMILY_NAME,
            [ClaimKeys.email]: EMAIL_VALUE,
            [ClaimKeys.legalCompanyName]: COMPANY_NAME,
          },
        },
      ],
    },
  },
  toasts: {
    active: null,
  },
}

const mockedNavigate = jest.fn()
const mockedCreateSignedCredentialFn = jest.fn()
const mockedDeleteSignedCredentialFn = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}))

jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    idw: {
      create: {
        signedCredential: mockedCreateSignedCredentialFn,
      },
    },
    passwordStore: {
      getPassword: jest.fn().mockResolvedValue(true),
    },
    storage: {
      store: {
        verifiableCredential: jest.fn().mockResolvedValue(true),
      },
      delete: {
        verifiableCredential: mockedDeleteSignedCredentialFn,
      },
    },
  }),
}))

const pressDots = (
  queryGetter: (testId: string | RegExp) => ReactTestInstance,
) => {
  const dots = queryGetter('card-action-more')
  fireEvent.press(dots)
}

const getPopupOptions = (
  queryGetter: (testId: string | RegExp) => ReactTestInstance,
) => {
  const popup = queryGetter('popup-menu')
  expect(popup).toBeDefined()
  const popupQueries = getQueriesForElement(popup)
  return popupQueries.getAllByTestId('popup-menu-button')
}

const findOption = (popupOptions: ReactTestInstance[], text: string) => {
  return popupOptions.find((o) => {
    return o.props.children.find((c) => c.props.children === text)
  })
}
describe('Business card is in state', () => {
  beforeEach(mockedNavigate.mockClear)

  test('placeholder', () => {
    const { getByText, getAllByText, getByTestId } = renderWithSafeArea(
      <IdentityBusinessCard />,
    )
    expect(getByText(strings.YOUR_INFO_IS_QUITE_EMPTY)).toBeDefined()
    expect(getByTestId('business-card-placeholder')).toBeDefined()

    expect(getByText(strings.YOUR_NAME)).toBeDefined()
    expect(getByText(strings.COMPANY)).toBeDefined()
    expect(getByText(strings.CONTACT_ME)).toBeDefined()
    expect(getAllByText(strings.NOT_SPECIFIED).length).toBe(2)

    // ASSERT POPUP
    pressDots(getByTestId)

    const popupOptions = getPopupOptions(getByTestId)
    expect(popupOptions.length).toBe(2)

    const editButton = findOption(popupOptions, strings.EDIT)

    if (editButton) {
      fireEvent.press(editButton)

      expect(mockedNavigate).toBeCalledTimes(1)
      expect(mockedNavigate).toBeCalledWith(ScreenNames.BusinessCardForm, {})
    }
  })

  test('credential', async () => {
    const mockDispatchFn = getMockedDispatch()
    mockSelectorReturn(mockedStore)
    mockedDeleteSignedCredentialFn.mockReturnValue(true)

    const { getByTestId } = renderWithSafeArea(<IdentityBusinessCard />)

    const businessCardCredential = getByTestId('business-card-credential')
    expect(businessCardCredential).toBeDefined()

    const businessCardQueries = getQueriesForElement(businessCardCredential)
    expect(businessCardQueries.getAllByTestId('card-field-value').length).toBe(
      2,
    )
    expect(
      businessCardQueries.getByText(`${GIVEN_NAME} ${FAMILY_NAME}`),
    ).toBeDefined()
    expect(businessCardQueries.getByText(EMAIL_VALUE)).toBeDefined()
    expect(businessCardQueries.getByText(COMPANY_NAME)).toBeDefined()

    pressDots(getByTestId)

    const popupOptions = getPopupOptions(getByTestId)
    expect(popupOptions.length).toBe(3)

    // press edit
    const editButton = findOption(popupOptions, strings.EDIT)
    if (editButton) {
      fireEvent.press(popupOptions[0])

      expect(mockedNavigate).toBeCalledTimes(1)
      expect(mockedNavigate).toBeCalledWith(ScreenNames.BusinessCardForm, {})
    }
    // press delete
    const deleteButton = findOption(popupOptions, strings.DELETE)
    if (deleteButton) {
      fireEvent.press(popupOptions[1])

      await waitFor(() => {
        expect(mockedDeleteSignedCredentialFn).toBeCalledTimes(1)
        expect(mockDispatchFn).toBeCalledTimes(1)
        expect(mockDispatchFn).toBeCalledWith(
          deleteAttr({ type: ATTRIBUTE_TYPE }),
        )
      })
    }
  })
})
