import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { editAttr } from '~/modules/attributes/actions'
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
const GIVEN_NAME_UPDATED = 'Karl'
const FAMILY_NAME = 'Muller'
const EMAIL_VALUE = 'dev@example.com'
const COMPANY_NAME = 'SmartWallet'
const TELEPHONE_VALUE = '123456789'

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

const mockedCreateSignedCredentialFn = jest.fn()
const mockDeleteVCFn = jest.fn()

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
        verifiableCredential: mockDeleteVCFn,
      },
    },
  }),
}))

test('Business card add', async () => {
  const mockDispatchFn = getMockedDispatch()
  mockSelectorReturn(mockedStore)
  mockDeleteVCFn.mockResolvedValue(true)
  mockedCreateSignedCredentialFn.mockResolvedValue({
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
    expect(mockedCreateSignedCredentialFn).toBeCalledTimes(1)
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
