import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { editAttr, updateAttrs } from '~/modules/attributes/actions'
import BusinessCardForm from '~/screens/Modals/Forms/BusinessCardForm'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { getMockedDispatch } from '../../utils/dispatch'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { mockSelectorReturn } from '../../utils/selector'

jest.mock('@react-navigation/native')

const ATTRIBUTE_ID = 'claim:businesscard:id'
const ATTRIBUTE_ID_UPDATED = 'claim:businesscard:id-1'
const ATTRIBUTE_TYPE = AttributeTypes.businessCard
const GIVEN_NAME = 'Karl'
const GIVEN_NAME_UPDATED = 'Karla'
const FAMILY_NAME = 'Muller'
const EMAIL_VALUE = 'dev@example.com'
const COMPANY_NAME = 'SmartWallet'
const TELEPHONE_VALUE = '123456789'

const mockedStoreBusinessCard = {
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

const mockedStoreNoBusinessCard = {
  account: {
    did: 'did-1',
  },
  attrs: {
    all: {},
  },
  toasts: {
    active: null,
  },
}

const mockedIssueCredentialFn = jest.fn()
const mockDeleteVCFn = jest.fn()

jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    passwordStore: {
      getPassword: jest.fn().mockResolvedValue(true),
    },
    credentials: {
      issue: mockedIssueCredentialFn,
      delete: mockDeleteVCFn,
    },
  }),
}))

describe('Business card mode', () => {
  let mockDispatchFn: jest.Mock
  beforeEach(() => {
    mockDispatchFn = getMockedDispatch()
  })
  afterEach(() => {
    mockDispatchFn.mockClear()
    mockedIssueCredentialFn.mockClear()
  })
  test('edit', async () => {
    mockSelectorReturn(mockedStoreBusinessCard)
    mockDeleteVCFn.mockResolvedValue(true)
    mockedIssueCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID_UPDATED,
      claim: {
        id: ATTRIBUTE_ID_UPDATED,
        [ClaimKeys.givenName]: GIVEN_NAME_UPDATED,
        [ClaimKeys.familyName]: FAMILY_NAME,
        [ClaimKeys.email]: EMAIL_VALUE,
        [ClaimKeys.telephone]: TELEPHONE_VALUE,
        [ClaimKeys.legalCompanyName]: COMPANY_NAME,
      },
    })

    const { getAllByTestId, getByTestId } = renderWithSafeArea(
      <BusinessCardForm />,
    )

    const inputs = getAllByTestId('business-card-input')
    expect(inputs.length).toBe(5)

    fireEvent.changeText(inputs[0], GIVEN_NAME_UPDATED)
    fireEvent.changeText(inputs[3], TELEPHONE_VALUE)

    const submitButton = getByTestId('form-container-submit')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockDeleteVCFn).toBeCalledTimes(1)
      expect(mockedIssueCredentialFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledWith(
        editAttr({
          type: ATTRIBUTE_TYPE,
          attribute: {
            id: ATTRIBUTE_ID_UPDATED,
            value: {
              [ClaimKeys.givenName]: GIVEN_NAME_UPDATED,
              [ClaimKeys.familyName]: FAMILY_NAME,
              [ClaimKeys.email]: EMAIL_VALUE,
              [ClaimKeys.telephone]: TELEPHONE_VALUE,
              [ClaimKeys.legalCompanyName]: COMPANY_NAME,
            },
          },
          id: ATTRIBUTE_ID,
        }),
      )
    })
  })
  test('add', async () => {
    mockSelectorReturn(mockedStoreNoBusinessCard)
    mockedIssueCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID,
      claim: {
        id: ATTRIBUTE_ID,
        [ClaimKeys.givenName]: GIVEN_NAME,
        [ClaimKeys.familyName]: FAMILY_NAME,
        [ClaimKeys.email]: EMAIL_VALUE,
        [ClaimKeys.telephone]: TELEPHONE_VALUE,
        [ClaimKeys.legalCompanyName]: COMPANY_NAME,
      },
    })

    const { getAllByTestId, getByTestId } = renderWithSafeArea(
      <BusinessCardForm />,
    )

    const inputs = getAllByTestId('business-card-input')
    expect(inputs.length).toBe(5)

    fireEvent.changeText(inputs[0], GIVEN_NAME)
    fireEvent.changeText(inputs[1], FAMILY_NAME)
    fireEvent.changeText(inputs[2], EMAIL_VALUE)
    fireEvent.changeText(inputs[3], TELEPHONE_VALUE)
    fireEvent.changeText(inputs[4], COMPANY_NAME)

    const submitButton = getByTestId('form-container-submit')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockedIssueCredentialFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledWith(
        updateAttrs({
          type: ATTRIBUTE_TYPE,
          attribute: {
            id: ATTRIBUTE_ID,
            value: {
              [ClaimKeys.givenName]: GIVEN_NAME,
              [ClaimKeys.familyName]: FAMILY_NAME,
              [ClaimKeys.email]: EMAIL_VALUE,
              [ClaimKeys.telephone]: TELEPHONE_VALUE,
              [ClaimKeys.legalCompanyName]: COMPANY_NAME,
            },
          },
        }),
      )
    })
  })
})
