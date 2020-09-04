import React from 'react'
import { Provider } from 'react-redux'
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

import { Lock } from '~/modals/Lock'
import {
  render,
  findByText,
  getByTestId,
  fireEvent,
  getAllByTestId,
  waitForElement,
  wait,
} from '@testing-library/react-native'
import configureStore, { MockStoreEnhanced } from 'redux-mock-store'

import { strings } from '~/translations/strings'
import { RootReducerI } from '~/types/reducer'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { Colors } from '~/utils/colors'

const mockStore = configureStore([])

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

describe('Lock screen', () => {
  let store: MockStoreEnhanced<Pick<RootReducerI, 'account' | 'appState'>>

  beforeEach(() => {
    store = mockStore({
      appState: {
        isPopup: false,
      },
      account: {
        isAppLocked: true,
        isLocalAuthSet: true,
        loggedIn: true,
      },
    })
  })
  test('Lock is visible', () => {
    // const { getByText } = render(
    //   <Provider store={store}>
    //     <Lock />
    //   </Provider>,
    // )
  })

  test('displays', async () => {
    const { findByText, getByTestId, getAllByTestId } = renderWithSafeArea(
      <Lock />,
    )

    // await wait(() => findByText(strings.ENTER_YOUR_PIN))
    // await waitForElement(() => findByText(strings.ENTER_YOUR_PIN))
    expect(findByText(strings.ENTER_YOUR_PIN)).toBeDefined()

    // const passcodeInput = getByTestId('passcode-digit-input')
    // const passcodeCells = getAllByTestId('passcode-cell')
    // passcodeCells.map((cell) => {
    //   expect(cell.parent?.parent?.props.style).toBe(Colors.error)
    // })
    // fireEvent.changeText(passcodeInput, '1234')
  })
})
