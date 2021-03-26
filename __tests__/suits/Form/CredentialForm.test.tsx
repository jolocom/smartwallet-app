import React from 'react'
import CredentialForm from '~/screens/Modals/Forms/CredentialForm'
import { useRoute } from '@react-navigation/native'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { AttributeTypes } from '~/types/credentials'
import { mockSelectorReturn } from '../../utils/selector'
import useTranslation from '~/hooks/useTranslation'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { editAttr } from '~/modules/attributes/actions'
import { getMockedDispatch } from '../../utils/dispatch'

const ATTRIBUTE_ID = 'claim:email:id'
const ATTRIBUTE_ID_UPDATED = 'claim:email:id-1'
const ATTRIBUTE_TYPE = AttributeTypes.emailAddress
const EMAIL_VALUE = 'dev@example.com'
const EMAIL_VALUE_UPDATED = 'dev@jolocom.com'

const mockedStore = {
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

const mockedCreateSignedCredentialFn = jest.fn()
const mockDeleteVCFn = jest.fn()

jest.mock('@react-navigation/native')
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('../../../src/hooks/useTranslation')
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

describe('Form in mode', () => {
  beforeAll(() => {
    // @ts-expect-error
    useTranslation.mockReturnValue({
      t: jest.fn().mockReturnValue('Something'), // TODO: This will return something for title and description
    })
  })
  test('edit', async () => {
    // ASSEMBLE

    // @ts-expect-error
    useRoute.mockReturnValue({
      params: {
        id: ATTRIBUTE_ID,
        type: ATTRIBUTE_TYPE,
      },
    })
    mockSelectorReturn(mockedStore)
    mockedCreateSignedCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID_UPDATED,
      claim: {
        id: ATTRIBUTE_ID_UPDATED,
        email: EMAIL_VALUE_UPDATED,
      },
    })

    const mockDispatchFn = getMockedDispatch()

    // RENDER
    const { getByTestId } = renderWithSafeArea(<CredentialForm />)

    const emailInput = getByTestId('credential-form-input')
    expect(emailInput).toBeDefined()

    fireEvent.changeText(emailInput, EMAIL_VALUE_UPDATED)

    expect(emailInput.props.value).toBe(EMAIL_VALUE_UPDATED)

    const doneBtn = getByTestId('form-container-submit')

    fireEvent.press(doneBtn)

    // ASSERT ASYNC SUBMIT HANDLING
    await waitFor(() => {
      expect(mockDeleteVCFn).toBeCalledTimes(1)
      expect(mockDeleteVCFn).toBeCalledWith(ATTRIBUTE_ID)

      expect(mockedCreateSignedCredentialFn).toBeCalledTimes(1)
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
})
