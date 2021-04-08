import { ReactTestInstance } from 'react-test-renderer'
import { fireEvent } from '@testing-library/react-native'

export const inputPasscode = (
  getter: (testID: string) => ReactTestInstance,
  passcode: number[],
) => {
  passcode.forEach((value) => {
    const button = getter(`keyboard-button-${value}`)
    fireEvent.press(button)
  })
}
