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

const ATTRIBUTE_ID = 'claim:id-1'
const GIVEN_NAME = 'Karl'
const FAMILY_NAME = 'Muller'
const EMAIL = 'dev@jolocom.com'
const TELEPHONE = '000000000'
const COMPANY_NAME = 'SmartWallet'

const mockedCreateSignedCredentialFn = jest.fn()

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
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
    },
  }),
}))

describe('Intro displays', () => {
  let mockDispatchFn: jest.Mock
  beforeAll(() => {
    mockDispatchFn = getMockedDispatch()
  })

  test('correct ui components initially', () => {
    const { getAllByTestId, getByText } = renderWithSafeArea(<IdentityIntro />)

    const wizardButtons = getAllByTestId('button')
    expect(wizardButtons.length).toBe(2)

    const { getByText: getSingleCredText } = getQueriesForElement(
      wizardButtons[0],
    )
    expect(getSingleCredText(strings.SINGLE_CREDENTIAL)).toBeDefined()

    const { getByText: getBusinessCredText } = getQueriesForElement(
      wizardButtons[1],
    )
    expect(getBusinessCredText(strings.BUSINESS_CARD)).toBeDefined()

    expect(getByText(strings.IT_IS_TIME_TO_CREATE)).toBeDefined()
  })

  beforeEach(() => {
    mockDispatchFn.mockClear()
    mockedCreateSignedCredentialFn.mockClear()
  })

  test('single credential wizard', async () => {
    mockedCreateSignedCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID,
      claim: {
        id: ATTRIBUTE_ID,
        givenName: GIVEN_NAME,
        familyName: FAMILY_NAME,
      },
    })

    const { getAllByTestId, getByTestId, getByText } = renderWithSafeArea(
      <IdentityIntro />,
    )

    const wizardButtons = getAllByTestId('button')
    fireEvent.press(wizardButtons[0])

    expect(getByText(strings.WHAT_IS_YOUR_NAME)).toBeDefined()

    const submitBtnStep1 = getByTestId('button')
    fireEvent.press(submitBtnStep1)

    expect(mockedCreateSignedCredentialFn).toBeCalledTimes(0)

    const inputs = getAllByTestId('wizard-input')
    fireEvent.changeText(inputs[0], GIVEN_NAME)
    fireEvent.changeText(inputs[1], FAMILY_NAME)

    fireEvent.press(submitBtnStep1)

    await waitFor(() => {
      expect(mockedCreateSignedCredentialFn).toBeCalledTimes(1)
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
    mockedCreateSignedCredentialFn.mockResolvedValue({
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

    const {
      getAllByTestId,
      getByTestId,
      getByText,
      debug,
    } = renderWithSafeArea(<IdentityIntro />)

    // TODO: this so not DRY
    const wizardButtons = getAllByTestId('button')
    fireEvent.press(wizardButtons[1])

    expect(getByText(strings.INTRODUCE_YOURSELF)).toBeDefined()

    const submitBtnStep1 = getByTestId('button')
    const inputsName = getAllByTestId('wizard-input')
    fireEvent.changeText(inputsName[0], GIVEN_NAME)
    fireEvent.changeText(inputsName[1], FAMILY_NAME)

    fireEvent.press(submitBtnStep1)

    await waitFor(() => {
      expect(getByText(strings.BEST_WAY_TO_CONTACT_YOU)).toBeDefined()
    })

    const submitBtnStep2 = getByTestId('button')
    const inputsContact = getAllByTestId('wizard-input')
    fireEvent.changeText(inputsContact[0], EMAIL)
    fireEvent.changeText(inputsContact[1], TELEPHONE)

    fireEvent.press(submitBtnStep2)

    await waitFor(() => {
      expect(getByText(strings.WHAT_COMPANY_DO_YOU_REPRESENT)).toBeDefined()
    })

    const submitBtnStep3 = getByTestId('button')
    const inputsCompany = getAllByTestId('wizard-input')
    fireEvent.changeText(inputsCompany[0], COMPANY_NAME)

    fireEvent.press(submitBtnStep3)

    await waitFor(() => {
      expect(mockedCreateSignedCredentialFn).toBeCalledTimes(1)
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
