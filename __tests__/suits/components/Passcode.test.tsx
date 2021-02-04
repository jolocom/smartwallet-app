import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Passcode from '~/components/Passcode';
import { strings } from '~/translations';
import { ScreenNames } from '~/types/screens';

const mockSubmit = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
 ...jest.requireActual('@react-navigation/native'),
 useFocusEffect: jest.fn().mockImplementation(() => { }),
 useNavigation: () => ({
  navigate: mockNavigate
 })
}))

test('Passcode input displays asterics and submits correct value', async () => {
 mockSubmit.mockResolvedValue(true);

 const { getByTestId, getAllByText } = render(
  <Passcode onSubmit={mockSubmit}>
   <Passcode.Input />
  </Passcode>
 )

 const input = getByTestId('passcode-digit-input');

 fireEvent.changeText(input, 1);
 expect(getAllByText('*').length).toBe(1)

 fireEvent.changeText(input, 1);
 expect(getAllByText('*').length).toBe(2)

 fireEvent.changeText(input, 1);
 expect(getAllByText('*').length).toBe(3)

 fireEvent.changeText(input, 1);
 expect(getAllByText('*').length).toBe(4)

 await waitFor(() => {
  expect(mockSubmit).toHaveBeenCalledTimes(1);
  expect(mockSubmit).toHaveBeenCalledWith('1111');
 })
})

test('Passcode Header displays error', async () => {
 mockSubmit.mockRejectedValue(false);

 const { getByText, getByTestId } = render(
  <Passcode onSubmit={mockSubmit}>
   <Passcode.Header title={strings.CREATE_PASSCODE} errorTitle={strings.WRONG_PASSCODE} />
   <Passcode.Input />
  </Passcode>
 )

 expect(getByText(strings.CREATE_PASSCODE)).toBeDefined()

 const input = getByTestId('passcode-digit-input');
 fireEvent.changeText(input, 1111);

 await waitFor(() => {
  expect(getByText(strings.WRONG_PASSCODE)).toBeDefined();
 })

})

test('Passcode Forgot navigates to an instruction screen', () => {
 const { getByText, getByTestId } = render(
  <Passcode onSubmit={mockSubmit}>
   <Passcode.Forgot />
  </Passcode>
 )

 expect(getByText(strings.FORGOT_YOUR_PIN)).toBeDefined();

 const forgotBtn = getByTestId('button');
 fireEvent.press(forgotBtn);

 expect(mockNavigate).toHaveBeenCalledTimes(1);
 expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.PinRecoveryInstructions, {})

})

