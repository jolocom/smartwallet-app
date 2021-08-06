import React from 'react'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import IdentityIntro from '~/screens/LoggedIn/Identity/IdentityIntro'
import {
  fireEvent,
  getQueriesForElement,
  waitFor,
} from '@testing-library/react-native'
import { getMockedDispatch } from '../../mocks/libs/react-redux'
import { updateAttrs } from '~/modules/attributes/actions'
import { AttributeTypes } from '~/types/credentials'
import { ReactTestInstance } from 'react-test-renderer'
import { mockedAgent } from '../../mocks/agent'

const ATTRIBUTE_ID = 'claim:id-1'
const GIVEN_NAME = 'Karl'
const FAMILY_NAME = 'Muller'

const mockedIssueCredentialFn = jest.fn()
// eslint-disable-next-line
const noop = () => {}

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    passwordStore: mockedAgent.passwordStore,
    credentials: {
      create: mockedIssueCredentialFn,
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
    const { getByText: getSingleCredText } = getQueriesForElement(
      singleCredentialButton,
    )

    expect(getSingleCredText(/Identity.widgetStartBtn/)).toBeDefined()

    expect(getByText(/Identity.widgetWelcome/)).toBeDefined()
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

    expect(getByText(/Identity.widgetNameHeader/)).toBeDefined()

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
})
