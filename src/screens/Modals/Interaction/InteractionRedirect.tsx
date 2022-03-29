import { RouteProp, useRoute } from '@react-navigation/core'
import React from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { SuccessTick } from '~/assets/svg'
import BottomSheet from '~/components/BottomSheet'
import JoloText from '~/components/JoloText'
import Space from '~/components/Space'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'
import { JoloTextSizes } from '~/utils/fonts'
import { InteractionStackParamList } from '.'
import InteractionFooter from './InteractionFlow/components/InteractionFooter'
import InteractionLogo from './InteractionFlow/components/InteractionLogo'
import InteractionTitle from './InteractionFlow/components/InteractionTitle'
import {
  ContainerBAS,
  LogoContainerBAS,
} from './InteractionFlow/components/styled'

const InteractionRedirect = () => {
  const { t } = useTranslation()
  const { params } =
    useRoute<
      RouteProp<InteractionStackParamList, ScreenNames.InteractionRedirect>
    >()
  const { serviceName, serviceLogo, redirectUrl, completeRedirect } = params

  const handleSubmit = async () => {
    //await Linking.openURL(redirectUrl!)
    completeRedirect()
  }

  return (
    <BottomSheet>
      <ContainerBAS>
        <LogoContainerBAS>{/*<InteractionLogo />*/}</LogoContainerBAS>
        <InteractionTitle label={t('Interaction.redirectTitle')} />
        <Space height={48} />
        <View style={styles.container}>
          <View style={styles.successContainer}>
            <SuccessTick color={Colors.white90} />
          </View>
        </View>
        <Space height={42} />
        <JoloText size={JoloTextSizes.big}>
          {t('Interaction.redirectDescription', { serviceName })}
        </JoloText>
        <Space height={20} />
        <InteractionFooter
          onSubmit={handleSubmit}
          submitLabel={t('Interaction.redirectBtn')}
        />
      </ContainerBAS>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 125,
    height: 125,
    borderWidth: 3,
    borderColor: Colors.white,
    borderRadius: 125 / 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContainer: {
    width: 60,
    height: 60,
  },
})

export default InteractionRedirect
