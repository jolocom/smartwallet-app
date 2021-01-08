import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { setGenericPassword, STORAGE_TYPE } from 'react-native-keychain'

import RegisterPin from '~/screens/Modals/DeviceAuthentication/RegisterPin';
import { strings } from '~/translations';
import { renderWithSafeArea } from '../utils/renderWithSafeArea';
import { PIN_USERNAME, PIN_SERVICE } from '~/utils/keychainConsts'


const mockNavigation = jest.fn();
const mockNavigationBack = jest.fn();
const mockedDispatch = jest.fn();


jest.mock('@react-navigation/native', () => ({
 ...jest.requireActual('@react-navigation/native'),
 useFocusEffect: jest.fn().mockImplementation(() => { }),
 useNavigation: () => ({
  navigation: mockNavigation,
  goBack: mockNavigationBack,
 }),
}))

jest.mock('react-redux', () => ({
 ...jest.requireActual('react-redux'),
 useSelector: jest.fn(),
 useDispatch: jest.fn().mockReturnValue(mockedDispatch)
}))

jest.mock('react-native-keychain', () => {
 return {
  STORAGE_TYPE: {
   AES: 'aes',
  },
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
 }
})


test('Register PIN screen behavior', async () => {
 const { getByText, getByTestId, queryByText } = renderWithSafeArea(<RegisterPin />)

 expect(getByText(strings.CREATE_PASSCODE)).toBeDefined();
 expect(getByText(strings.IN_ORDER_TO_PROTECT_YOUR_DATA)).toBeDefined();
 expect(queryByText(/strings.YOU_CAN_CHANGE_THE_PASSCODE/)).toBeDefined()


 const input = getByTestId('passcode-digit-input');
 fireEvent.changeText(input, 1111);

 expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined();
 expect(getByText(strings.ADDING_AN_EXTRA_LAYER_OF_SECURITY)).toBeDefined();


 fireEvent.changeText(input, 1112);

 await waitFor(() => {
  // expect input to clean up because pins don't match
  expect(queryByText('*')).toBe(null)
 })

 fireEvent.changeText(input, 1111);

 expect(setGenericPassword).toHaveBeenCalledTimes(1)
 expect(setGenericPassword).toHaveBeenCalledWith(PIN_USERNAME, '1111', {
  service: PIN_SERVICE,
  storage: STORAGE_TYPE.AES,
 })
})


