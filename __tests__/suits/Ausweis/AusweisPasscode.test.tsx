import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { useNavigation, useRoute } from '@react-navigation/native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'

import React from 'react'
import { AusweisPasscode } from '~/screens/LoggedIn/eID/components'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerParams,
  eIDScreens,
} from '~/screens/LoggedIn/eID/types'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { inputPasscode } from '../../utils/inputPasscode'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { getMockedDispatch } from '../../mocks/libs/react-redux'
import eIDHooks from '~/screens/LoggedIn/eID/hooks'

jest.mock('@react-navigation/native')

describe('Ausweis passcode screen', () => {
  let registeredHandlers: Partial<EventHandlers>
  let mockedNavigation = jest.fn()
  let mockedNavigationDispatch = jest.fn()
  beforeAll(() => {
    ;(aa2Module.setHandlers as jest.Mock).mockImplementation((handlers) => {
      registeredHandlers = handlers
    })
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: mockedNavigation,
      dispatch: mockedNavigationDispatch,
    })
    jest.spyOn(eIDHooks, 'useAusweisScanner').mockReturnValue({
      updateScanner: jest
        .fn()
        .mockImplementation((params: Partial<AusweisScannerParams>) => {
          params.onDone && params.onDone()
        }),
      showScanner: jest.fn(),
    })
    jest.spyOn(eIDHooks, 'useAusweisCancelBackHandler')
  })

  test('message handlers for the Ausweis screen were registered', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {},
    })
    renderWithSafeArea(<AusweisPasscode />)

    await waitFor(() => {
      expect(aa2Module.setHandlers).toBeCalledWith(
        expect.objectContaining({
          handleCardRequest: expect.any(Function),
          handleCardInfo: expect.any(Function),
          handleAuthFailed: expect.any(Function),
          handleAuthSuccess: expect.any(Function),
          handlePinRequest: expect.any(Function),
          handleCanRequest: expect.any(Function),
          handlePukRequest: expect.any(Function),
          handleChangePinSuccess: expect.any(Function),
          handleChangePinCancel: expect.any(Function),
          handleEnterNewPin: expect.any(Function),
        }),
      )
    })
  })
  test('user successfully completes the AUTH flow', async () => {
    // @ts-ignore
    fetch = jest.fn(() => Promise.resolve())
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      ausweis: {
        scannerKey: null,
      },
    })
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        mode: AusweisPasscodeMode.PIN,
        pinContext: AusweisPasscodeMode.PIN,
        flow: AusweisFlow.auth,
      },
    })

    const { findByTestId, getByText, getByTestId } = renderWithSafeArea(
      <AusweisPasscode />,
    )

    expect(getByText('AusweisPasscode.authPinHeader')).toBeDefined()

    /**
     * Input incorrect eID pin
     */
    inputPasscode(getByTestId, [1, 1, 1, 1, 1, 1])

    await waitFor(() => {
      expect(aa2Module.setPin).toBeCalledWith('111111')
    })

    /**
     * Immitate showing scanner
     * Note: full functionality of the Scanner will be tested
     * in the AusweisScanner test file
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    /**
     * Immitating ENTER_PIN message to be
     * dispatched by the AA2 sdk and handlePinRequest
     * to be invoked
     */
    act(() => {
      registeredHandlers!.handlePinRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 2,
      })
    })
    const passcodeError = await findByTestId('passcode-error')
    expect(passcodeError).toBeDefined()
    expect(passcodeError.props.children).toBe('Lock.errorMsg{"attempts":"1∕3"}')

    /**
     * Input the first digit of the incorrect eID PIN
     */
    inputPasscode(getByTestId, [1])

    /**
     * Wait for the passcode input error to be reset
     */
    await waitFor(() => {
      expect(passcodeError.props.children).toBe(null)
    })

    /**
     * Input the rest of the incorrect eID PIN
     */
    inputPasscode(getByTestId, [0, 0, 0, 0, 0])

    await waitFor(() => {
      expect(aa2Module.setPin).toBeCalledWith('100000')
    })

    /**
     * Immitate showing scanner
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    /**
     * Immitating ENTER_CAN message to be
     * dispatched by the AA2 sdk and handleCanRequest
     * to be invoked
     * NOTE: dismissing invoking handleCardRequest, because
     * it is tested in the AusweisScanner
     */
    act(() => {
      registeredHandlers!.handleCanRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })

    expect(getByText('AusweisPasscode.canHeader')).toBeDefined()

    /**
     * Input wrong CAN
     */
    inputPasscode(getByTestId, [1, 2, 3, 4, 5, 6])

    await waitFor(() => {
      expect(aa2Module.setCan).toBeCalledWith('123456')
    })

    /**
     * Immitate showing scanner
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    act(() => {
      registeredHandlers!.handleCanRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })

    expect(passcodeError.props.children).toBe(
      'AusweisPasscode.pinWrongError{"pinVariant":"CAN"}',
    )

    /**
     * Input correct CAN
     */
    inputPasscode(getByTestId, [1, 1, 1, 1, 1, 1])

    await waitFor(() => {
      expect(aa2Module.setCan).toBeCalledWith('111111')
    })

    act(() => {
      registeredHandlers!.handlePinRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })

    expect(passcodeError.props.children).toBe(null)

    /**
     * Input wrong PIN
     */
    inputPasscode(getByTestId, [0, 0, 0, 0, 0, 0])

    await waitFor(() => {
      expect(aa2Module.setPin).toBeCalledWith('000000')
    })

    /**
     * Immitate showing scanner
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    act(() => {
      registeredHandlers!.handlePukRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })

    /**
     * Wait for the navigation to the PUK Lock info screen
     */
    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledTimes(1)
      expect(mockedNavigation).toHaveBeenCalledWith(eIDScreens.PukLock)
    })

    /**
     * Immitate PUK request handler
     */
    act(() => {
      registeredHandlers!.handlePukRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 0,
      })
    })
    await waitFor(() => {
      expect(getByText('AusweisPasscode.pukHeader')).toBeDefined()
    })
    inputPasscode(getByTestId, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    await waitFor(() => {
      expect(aa2Module.setPuk).toBeCalledWith('0123456789')
    })

    const url = 'http://ausweis-success.de'
    /**
     * Immitate successful completion of AuthFlow
     */
    act(() => {
      registeredHandlers!.handleAuthSuccess!(url)
    })
    await waitFor(() => {
      expect(global.fetch).toBeCalledWith(url)
    })
  })

  test('user is asked to provide CAN in the CHANGE_PIN flow', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        mode: AusweisPasscodeMode.CAN,
        flow: AusweisFlow.changePin,
      },
    })
    const { findByTestId, getByText, getByTestId } = renderWithSafeArea(
      <AusweisPasscode />,
    )

    expect(getByText('AusweisPasscode.canHeader')).toBeDefined()

    /*
     * Input incorrect eID can
     */
    inputPasscode(getByTestId, [1, 1, 1, 1, 1, 1])

    await waitFor(() => {
      expect(aa2Module.setCan).toBeCalledWith('111111')
    })

    /**
     * Immitate showing scanner
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    /**
     * Immitating ENTER_CAN
     * to be invoked
     */
    act(() => {
      registeredHandlers!.handleCanRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 2,
      })
    })
    const passcodeError = await findByTestId('passcode-error')
    expect(passcodeError).toBeDefined()
    expect(passcodeError.props.children).toBe(
      'AusweisPasscode.pinWrongError{"pinVariant":"CAN"}',
    )

    /**
     * Input correct CAN
     */
    inputPasscode(getByTestId, [0, 1, 1, 1, 1, 1])

    await waitFor(() => {
      expect(aa2Module.setCan).toBeCalledWith('011111')
    })

    /**
     * Immitate showing scanner
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    /**
     * immitate ENTER_PUK message
     */
    act(() => {
      registeredHandlers!.handlePukRequest!({
        inoperative: false,
        deactivated: false,
        retryCounter: 1,
      })
    })

    /**
     * Asserting abort of the CHANGE_PIN flow
     * when PUK is requested
     */
    expect(mockedNavigationDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          name: 'TransparentModals',
          params: {
            params: {
              mode: 'standaloneUnblock',
              onDismiss: expect.any(Function),
            },
            screen: 'AusweisCardInfo',
          },
        },
      }),
    )
  })

  test('user introduces new eID pin', async () => {
    getMockedDispatch()
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        mode: AusweisPasscodeMode.PIN,
        pinContext: AusweisPasscodeMode.PIN,
        flow: AusweisFlow.changePin,
      },
    })

    const { findByTestId, getByText, getByTestId } = renderWithSafeArea(
      <AusweisPasscode />,
    )
    /**
     * Enter correct eID pin
     */
    inputPasscode(getByTestId, [1, 1, 1, 1, 1, 1])

    await waitFor(() => {
      expect(aa2Module.setCan).toBeCalledWith('111111')
    })
    /**
     * Immitate showing scanner
     */
    act(() => {
      registeredHandlers!.handleCardRequest!()
    })
    /**
     * immitate ENTER_NEW_PIN message
     */
    act(() => {
      registeredHandlers!.handleEnterNewPin!()
    })
    expect(getByText('AusweisPasscode.newPinHeader')).toBeDefined()
    /**
     * Enter new eID pin
     */
    inputPasscode(getByTestId, [1, 1, 1, 1, 1, 1])
    await waitFor(() => {
      expect(getByText('AusweisPasscode.repeatNewPinHeader')).toBeDefined()
    })
    /**
     * Reset new eID pin
     */
    const resetPinBtn = getByText('VerifyPasscode.resetBtn')
    act(() => {
      fireEvent.press(resetPinBtn)
    })

    await waitFor(() => {
      expect(getByText('AusweisPasscode.newPinHeader')).toBeDefined()
    })
    inputPasscode(getByTestId, [0, 0, 0, 0, 0, 0])
    await waitFor(() => {
      expect(getByText('AusweisPasscode.repeatNewPinHeader')).toBeDefined()
    })
    /**
     * Repeat new eID pin
     */
    inputPasscode(getByTestId, [1, 1, 1, 1, 1, 1])

    const passcodeError = await findByTestId('passcode-error')
    await waitFor(() => {
      expect(passcodeError.props.children).toBe('AusweisPasscode.pinMatchError')
    })

    inputPasscode(getByTestId, [0, 0, 0, 0, 0, 0])
    await waitFor(() => {
      expect(aa2Module.setNewPin).toBeCalledWith('000000')
    })
    /**
     * Immitate CHANGE_PIN success message
     */

    act(() => {
      registeredHandlers!.handleChangePinSuccess!()
    })
    await waitFor(() => {
      /**
       * TODO: test showing toast
       */
    })
  })
})
