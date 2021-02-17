import React from 'react'
import Permissions from 'react-native-permissions'

import ScannerIntro from '~/screens/Modals/Interaction/Scanner'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { strings } from '~/translations/strings'
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

test('it displays permission request, denies it and opens settings ', async () => {
  const request = jest.spyOn(Permissions, 'request')
  request.mockResolvedValueOnce('denied')
  const openSettings = jest.spyOn(Permissions, 'openSettings')
  openSettings.mockResolvedValue()

  const { getByText } = renderWithSafeArea(<ScannerIntro />)

  expect(getByText(strings.CAMERA_PERMISSION)).toBeDefined()

  fireEvent.press(getByText(strings.TAP_TO_ACTIVATE_CAMERA))

  await waitFor(() => expect(openSettings).toHaveBeenCalledTimes(1))
})
