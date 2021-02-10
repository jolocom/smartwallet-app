import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { setGenericPassword, STORAGE_TYPE } from 'react-native-keychain';
import ChangePin from '~/screens/LoggedIn/Settings/ChangePin';
import { strings } from '~/translations';
import { PIN_SERVICE, PIN_USERNAME } from '~/utils/keychainConsts';
import { renderWithSafeArea } from '../../utils/renderWithSafeArea';

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


jest.mock('../../../src/hooks/deviceAuth', () => ({
 useGetStoredAuthValues: jest.fn().mockImplementation(() => ({
  keychainPin: '5555'
 }))
}))

jest.mock('../../../src/hooks/navigation', () => ({
 useGoBack: jest.fn().mockReturnValue(true),
 useRedirectTo: jest.fn
}))

test('User is able to change a pin', async () => {

 const { debug, getByText, getByTestId, queryByText } = renderWithSafeArea(<ChangePin />);

 expect(getByText(strings.CURRENT_PASSCODE)).toBeDefined();

 const input = getByTestId('passcode-digit-input');
 fireEvent.changeText(input, 3333);

 await waitFor(() => {
  expect(getByText(strings.WRONG_PASSCODE)).toBeDefined();
 })

 await waitFor(() => {
  expect(queryByText('*')).toBe(null)
 })

 fireEvent.changeText(input, 5555);

 await waitFor(() => {
  expect(getByText(strings.CREATE_NEW_PASSCODE)).toBeDefined();
 })

 fireEvent.changeText(input, 3333);

 expect(setGenericPassword).toHaveBeenCalledTimes(1)
 expect(setGenericPassword).toHaveBeenCalledWith(PIN_USERNAME, '3333', {
  service: PIN_SERVICE,
  storage: STORAGE_TYPE.AES,
 })
})