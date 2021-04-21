import React from 'react'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import IdentityIntro from '~/screens/LoggedIn/Identity/IdentityIntro'
import {
  fireEvent,
  getQueriesForElement,
  waitFor,
} from '@testing-library/react-native'
import { strings } from '~/translations'
import { getMockedDispatch } from '../../utils/dispatch'
import { updateAttrs } from '~/modules/attributes/actions'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { ReactTestInstance } from 'react-test-renderer'

const ATTRIBUTE_ID = 'claim:id-1'
const GIVEN_NAME = 'Karl'
const FAMILY_NAME = 'Muller'
const EMAIL = 'dev@jolocom.com'
const TELEPHONE = '000000000'
const COMPANY_NAME = 'SmartWallet'

const mockedIssueCredentialFn = jest.fn()
const noop = () => {}

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    passwordStore: {
      getPassword: jest.fn().mockResolvedValue(true),
    },
    credentials: {
      issue: mockedIssueCredentialFn,
    },
  }),
}))

const populateInputs = (inputs: ReactTestInstance[], values: string[]) => {
  if (inputs.length !== values.length) return
  values.forEach((v, idx) => fireEvent.changeText(inputs[idx], v))
}

describe('Intro displays', () => {
  let mockDispatchFn: jest.Mock
  beforeAll(() => {
    mockDispatchFn = getMockedDispatch()
  })

  test('correct ui components initially', () => {
    const { getByTestId, getByText } = renderWithSafeArea(
      <IdentityIntro onSubmit={noop} />,
    )

    const singleCredentialButton = getByTestId('single-credential-button')
    const businessCardButton = getByTestId('business-card-button')
    const { getByText: getSingleCredText } = getQueriesForElement(
      singleCredentialButton,
    )

    expect(getSingleCredText(strings.SINGLE_CREDENTIAL)).toBeDefined()

    const { getByText: getBusinessCredText } = getQueriesForElement(
      businessCardButton,
    )
    expect(getBusinessCredText(strings.BUSINESS_CARD)).toBeDefined()

    expect(getByText(strings.IT_IS_TIME_TO_CREATE)).toBeDefined()
  })

  beforeEach(() => {
    mockDispatchFn.mockClear()
    mockedIssueCredentialFn.mockClear()
  })

  test('single credential wizard', async () => {
    mockedIssueCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID,
      claim: {
        id: ATTRIBUTE_ID,
        givenName: GIVEN_NAME,
        familyName: FAMILY_NAME,
      },
    })

    const { getByText, getAllByTestId, getByTestId } = renderWithSafeArea(
      <IdentityIntro onSubmit={noop} />,
    )

    const singleCredentialButton = getByTestId('single-credential-button')
    fireEvent.press(singleCredentialButton)

    expect(getByText(strings.WHAT_IS_YOUR_NAME)).toBeDefined()

    const submitBtnStep1 = getByTestId('button')
    fireEvent.press(submitBtnStep1)

    expect(mockedIssueCredentialFn).toBeCalledTimes(0)

    const inputs = getAllByTestId('wizard-input')
    populateInputs(inputs, [GIVEN_NAME, FAMILY_NAME])

    fireEvent.press(submitBtnStep1)

    await waitFor(() => {
      expect(mockedIssueCredentialFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledWith(
        updateAttrs({
          type: AttributeTypes.name,
          attribute: {
            id: ATTRIBUTE_ID,
            value: { givenName: GIVEN_NAME, familyName: FAMILY_NAME },
          },
        }),
      )
    })
  })

  test('business credential wizard', async () => {
    mockedIssueCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID,
      claim: {
        id: ATTRIBUTE_ID,
        givenName: GIVEN_NAME,
        familyName: FAMILY_NAME,
        email: EMAIL,
        telephone: TELEPHONE,
        legalCompanyName: COMPANY_NAME,
      },
    })

    const { getByText, getAllByTestId, getByTestId } = renderWithSafeArea(
      <IdentityIntro onSubmit={noop} />,
    )

    const businessCardButton = getByTestId('business-card-button')
    fireEvent.press(businessCardButton)

    expect(getByText(strings.INTRODUCE_YOURSELF)).toBeDefined()

    const submitBtnStep1 = getByTestId('button')
    const inputsName = getAllByTestId('wizard-input')

    populateInputs(inputsName, [GIVEN_NAME, FAMILY_NAME])

    fireEvent.press(submitBtnStep1)

    await waitFor(() => {
      expect(getByText(strings.BEST_WAY_TO_CONTACT_YOU)).toBeDefined()
    })

    const submitBtnStep2 = getByTestId('button')
    const inputsContact = getAllByTestId('wizard-input')

    populateInputs(inputsContact, [EMAIL, TELEPHONE])

    fireEvent.press(submitBtnStep2)

    await waitFor(() => {
      expect(getByText(strings.WHAT_COMPANY_DO_YOU_REPRESENT)).toBeDefined()
    })

    const submitBtnStep3 = getByTestId('button')
    const inputsCompany = getAllByTestId('wizard-input')

    populateInputs(inputsCompany, [COMPANY_NAME])

    fireEvent.press(submitBtnStep3)

    await waitFor(() => {
      expect(mockedIssueCredentialFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledTimes(1)
      expect(mockDispatchFn).toBeCalledWith(
        updateAttrs({
          type: AttributeTypes.businessCard,
          attribute: {
            id: ATTRIBUTE_ID,
            value: {
              [ClaimKeys.givenName]: GIVEN_NAME,
              [ClaimKeys.familyName]: FAMILY_NAME,
              [ClaimKeys.telephone]: TELEPHONE,
              [ClaimKeys.email]: EMAIL,
              [ClaimKeys.legalCompanyName]: COMPANY_NAME,
            },
          },
        }),
      )
    })
  })
})
