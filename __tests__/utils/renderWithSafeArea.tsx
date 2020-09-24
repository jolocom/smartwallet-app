import React, { ReactElement } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { render } from '@testing-library/react-native'

const TestSafeAreaProvider: React.FC = ({ children }) => {
  return (
    <SafeAreaProvider
      initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {children}
    </SafeAreaProvider>
  )
}
export const renderWithSafeArea = <T extends {}>(
  component: ReactElement<T>,
) => {
  return render(<TestSafeAreaProvider>{component}</TestSafeAreaProvider>)
}
