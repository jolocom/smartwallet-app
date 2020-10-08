import { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { useDispatch } from 'react-redux'
import Btn from '~/components/Btn'
import useRedirectTo from '~/hooks/useRedirectTo'
import { setLogged } from '~/modules/account/actions'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'

interface PropsI {
  navigation: NavigationProp<{}>
}

const PinRecoveryInstructions: React.FC<PropsI> = ({ navigation }) => {
  const dispatch = useDispatch()
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery)
  const handleRestoreClick = () => {
    dispatch(setLogged(false))
    redirectToRecovery()
  }
  return <Btn onPress={handleRestoreClick}>{strings.RESTORE_ACCESS}</Btn>
}

export default PinRecoveryInstructions
