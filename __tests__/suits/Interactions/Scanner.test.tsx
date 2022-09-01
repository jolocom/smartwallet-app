import React from 'react'
import Permissions from 'react-native-permissions'
import Scanner from '~/screens/Modals/Interaction/Scanner'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { fireEvent, waitFor } from '@testing-library/react-native'

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
    },
  },
  request: jest.fn(),
  openSettings: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
    goBack: jest.fn(),
  }),
  createNavigatorFactory: jest.fn(),
}))

jest.mock('@react-navigation/core', () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
}))

test('it displays permission request, denies it and opens settings ', async () => {
  const request = jest.spyOn(Permissions, 'request')
  request.mockResolvedValueOnce('denied')
  const openSettings = jest.spyOn(Permissions, 'openSettings')
  openSettings.mockResolvedValue()

  const { getByText } = renderWithSafeArea(<Scanner />)

  expect(getByText(/CameraPermission.header/)).toBeDefined()

  fireEvent.press(getByText(/CameraPermission.confirmBtn/))

  await waitFor(() => expect(openSettings).toHaveBeenCalledTimes(1))
})
