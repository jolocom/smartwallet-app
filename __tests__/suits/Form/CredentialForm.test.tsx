import React from 'react'
import CredentialForm from '~/screens/Modals/Forms/CredentialForm'
import { useRoute } from '@react-navigation/native'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { editAttr, updateAttrs } from '~/modules/attributes/actions'
import { getMockedDispatch } from '../../mocks/libs/react-redux'
import { mockedAgent } from '../../mocks/agent'
import { mockedNoAttributes } from '../../mocks/store/attributes'

const ATTRIBUTE_ID = 'claim:email:id'
const ATTRIBUTE_ID_UPDATED = 'claim:email:id-1'
const ATTRIBUTE_TYPE = AttributeTypes.emailAddress
const EMAIL_VALUE = 'dev@example.com'
const EMAIL_VALUE_UPDATED = 'dev@jolocom.com'

const mockedStore = {
  account: { did: 'did-1' },
  toasts: { active: null },
  attrs: {
    all: {
      [ATTRIBUTE_TYPE]: [
        {
          id: ATTRIBUTE_ID,
          value: {
            email: EMAIL_VALUE,
          },
        },
      ],
    },
  },
}

const mockedIssueCredentialFn = jest.fn()
const mockDeleteVCFn = jest.fn()

jest.mock('@react-navigation/native')
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    passwordStore: mockedAgent.passwordStore,
    credentials: {
      create: mockedIssueCredentialFn,
      delete: mockDeleteVCFn,
    },
  }),
}))

const renderCredentialForm = () => {
  const queries = renderWithSafeArea(<CredentialForm />)

  queries.debug()
  const emailInput = queries.getByTestId('credential-form-input')
  expect(emailInput).toBeDefined()

  // update input field
  fireEvent.changeText(emailInput, EMAIL_VALUE_UPDATED)

  expect(emailInput.props.value).toBe(EMAIL_VALUE_UPDATED)

  const doneBtn = queries.getByTestId('form-container-submit')

  // submit credential
  fireEvent.press(doneBtn)

  return queries
}

describe('Form in mode', () => {
  let mockDispatchFn: jest.Mock

  beforeAll(() => {
    mockDispatchFn = getMockedDispatch()
  })

  beforeEach(() => {
    mockDispatchFn.mockClear()
    mockedIssueCredentialFn.mockClear()
    mockedIssueCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID_UPDATED,
      claim: {
        id: ATTRIBUTE_ID_UPDATED,
        [ClaimKeys.email]: EMAIL_VALUE_UPDATED,
      },
    })
  })

  xtest('edit', async () => {
    // ASSEMBLE
    // @ts-expect-error
    useRoute.mockReturnValue({
      params: {
        id: ATTRIBUTE_ID,
        type: ATTRIBUTE_TYPE,
      },
    })
    mockSelectorReturn(mockedStore)

    // RENDER
    const queries = renderCredentialForm()

    expect(
      queries.getAllByText(/CredentialForm.editHeader/).length,
    ).toBeDefined()
    expect(queries.getByText(/CredentialForm.subheader/)).toBeDefined()

    // ASSERT ASYNC SUBMIT HANDLING
    await waitFor(() => {
      expect(mockDeleteVCFn).toBeCalledTimes(1)
      expect(mockDeleteVCFn).toBeCalledWith({ id: ATTRIBUTE_ID })

      expect(mockedIssueCredentialFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledWith(
        editAttr({
          id: ATTRIBUTE_ID,
          type: ATTRIBUTE_TYPE,
          attribute: {
            id: ATTRIBUTE_ID_UPDATED,
            value: { email: EMAIL_VALUE_UPDATED },
          },
        }),
      )
    })
  })

  xtest('create', async () => {
    // ASSEMBLE
    // @ts-expect-error
    useRoute.mockReturnValue({
      params: {
        type: ATTRIBUTE_TYPE,
      },
    })
    mockSelectorReturn(mockedNoAttributes)

    // RENDER
    const queries = renderCredentialForm()

    expect(
      queries.getAllByText(/CredentialForm.addHeader/).length,
    ).toBeDefined()
    expect(queries.getByText(/CredentialForm.subheader/)).toBeDefined()

    // ASSERT ASYNC SUBMIT HANDLING
    await waitFor(() => {
      expect(mockedIssueCredentialFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledWith(
        updateAttrs({
          type: ATTRIBUTE_TYPE,
          attribute: {
            id: ATTRIBUTE_ID_UPDATED,
            value: { email: EMAIL_VALUE_UPDATED },
          },
        }),
      )
    })
  })
})
