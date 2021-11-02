import React from 'react'
import { View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

interface WhateverProps {
  headerText: string
  descriptionText: string
  hasInlineBtn?: boolean
  btnText: string
  onPress: () => void
}

const TitleDescAction: React.FC<WhateverProps> = ({
  headerText,
  descriptionText,
  hasInlineBtn = false,
  btnText,
  onPress,
}) => {
  return (
    <View style={{ marginBottom: BP({ default: 30, xsmall: 20 }) }}>
      <ScreenContainer.Padding distance={BP({ default: 27, xsmall: 20 })}>
        <JoloText
          kind={JoloTextKind.title}
          customStyles={{ marginBottom: BP({ large: 12, default: 8 }) }}
        >
          {headerText}
        </JoloText>
        <JoloText color={Colors.osloGray}>
          {descriptionText}
          {hasInlineBtn && (
            <JoloText onPress={onPress} color={Colors.activity}>
              ...find more
            </JoloText>
          )}
        </JoloText>
        {!hasInlineBtn && (
          <Btn onPress={onPress} type={BtnTypes.quaternary}>
            {btnText}
          </Btn>
        )}
      </ScreenContainer.Padding>
    </View>
  )
}

const AusweisChangePin = () => {
  const { t } = useTranslation()

  const handleChange5DigPin = () => {
    console.warn('not implemented')
  }
  const handleChange6DigPin = () => {
    console.warn('not implemented')
  }
  const handlePreviewAuthorityInfo = () => {
    console.warn('not implemented')
  }

  return (
    <ScreenContainer
      hasHeaderBack
      navigationStyles={{ backgroundColor: Colors.mainBlack }}
      customStyles={{ justifyContent: 'space-around' }}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TitleDescAction
          headerText={t('AusweisChangePin.transportPinHeader')}
          descriptionText={t('AusweisChangePin.transportPinSubheader')}
          btnText={t('AusweisChangePin.transportPinBtn')}
          onPress={handleChange5DigPin}
        />
        <TitleDescAction
          headerText={t('AusweisChangePin.pinHeader')}
          descriptionText={t('AusweisChangePin.pinSubheader')}
          btnText={t('AusweisChangePin.pinBtn')}
          onPress={handleChange6DigPin}
        />
      </View>
      <TitleDescAction
        hasInlineBtn
        headerText={t('AusweisChangePin.forgotHeader')}
        descriptionText={t('AusweisChangePin.forgotSubheader')}
        btnText={t('AusweisChangePin.forgotBtn')}
        onPress={handlePreviewAuthorityInfo}
      />
    </ScreenContainer>
  )
}

export default AusweisChangePin
