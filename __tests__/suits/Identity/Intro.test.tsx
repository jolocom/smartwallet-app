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
import { AttributeTypes } from '~/types/credentials'

const ATTRIBUTE_ID = 'claim:id-1'
const GIVEN_NAME = 'Karl'
const FAMILY_NAME = 'Muller'

const mockedCreateSignedCredentialFn = jest.fn()

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
// TODO: this is the same mock as in Credential Form
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
  xtest('correct ui components initially', () => {
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

  test('single credential wizard', async () => {
    const mockDispatchFn = getMockedDispatch()
    mockedCreateSignedCredentialFn.mockResolvedValue({
      id: ATTRIBUTE_ID,
      claim: {
        id: ATTRIBUTE_ID,
        givenName: GIVEN_NAME,
        familyName: FAMILY_NAME,
      },
    })

    const {
      getAllByTestId,
      getByTestId,
      getByText,
      debug,
    } = renderWithSafeArea(<IdentityIntro />)

    const wizardButtons = getAllByTestId('button')
    fireEvent.press(wizardButtons[0])

    expect(getByText(strings.WHAT_IS_YOUR_NAME)).toBeDefined()

    // expect(submitBtn.props.disabled).toBe(true)
    const submitBtn = getByTestId('button')

    const inputs = getAllByTestId('wizard-input')
    fireEvent.changeText(inputs[0], GIVEN_NAME)
    fireEvent.changeText(inputs[1], FAMILY_NAME)

    fireEvent.press(submitBtn)

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
})
