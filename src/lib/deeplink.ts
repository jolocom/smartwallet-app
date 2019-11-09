
import { SendResponse } from './transportLayers'
import { Linking } from 'react-native'

export const respond: SendResponse = (token, route) =>
    Linking.canOpenURL(route ? route : '').then(async (can) =>
    can && await Linking.openURL(`${route ? route : ''}${token}`))
