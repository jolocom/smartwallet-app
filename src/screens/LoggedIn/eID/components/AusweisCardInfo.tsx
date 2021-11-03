import { RouteProp, useRoute } from '@react-navigation/core'
import React from 'react'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { TransparentModalsParamsList } from '../../Main'
import { useAusweisInteraction } from '../hooks'

const AusweisCardInfo = () => {
  const { title } =
    useRoute<
      RouteProp<TransparentModalsParamsList, ScreenNames.AusweisCardInfo>
    >().params
  const { t } = useTranslation()
  const { cancelInteraction } = useAusweisInteraction()

  const handleDismiss = () => {
    cancelInteraction()
  }

  return (
    <ScreenContainer backgroundColor={Colors.black90}>
      <ScreenContainer.Padding>
        <JoloText kind={JoloTextKind.title}>{title}</JoloText>
      </ScreenContainer.Padding>
      <Btn type={BtnTypes.secondary} onPress={handleDismiss}>
        {t('Errors.closeBtn')}
      </Btn>
    </ScreenContainer>
  )
}

export default AusweisCardInfo
