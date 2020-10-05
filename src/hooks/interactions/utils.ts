import { Alert } from 'react-native'

export const showNotification = (title: string, message?: string) => {
  setTimeout(() => {
    Alert.alert(title, message)
  }, 500)
}
