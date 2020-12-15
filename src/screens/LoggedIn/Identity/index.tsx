import React, { useState, useEffect } from 'react'
import { Image, LayoutAnimation } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import TopSheet from '~/components/TopSheet'
import { getAttributes } from '~/modules/attributes/selectors'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'

enum IdentityForms {
  SingleCredential = 'SingleCredential',
  BusinessCard = 'BusinessCard',
}

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const [isTopSheetVisible, setTopSheetVisibility] = useState(true)
  const [activeForm, setActiveForm] = useState<IdentityForms | null>(null)

  const { top } = useSafeArea()

  const animateActiveForm = (form: IdentityForms | null) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 400,
    })
    setActiveForm(form)
  }

  return (
    <ScreenContainer isFullscreen>
      <TopSheet
        onClose={() => setTopSheetVisibility(false)}
        // isVisible={Boolean(Object.keys(attributes).length)}
        isVisible={isTopSheetVisible}
        customStyles={{ alignItems: 'center', paddingTop: top }}
      >
        {!activeForm && (
          <>
            <Image source={require('~/assets/images/identityIntro.png')} />
            <JoloText
              kind={JoloTextKind.title}
              color={Colors.white90}
              customStyles={{ marginVertical: 10 }}
            >
              {strings.IT_IS_TIME_TO_CREATE}
            </JoloText>

            <Btn
              onPress={() => animateActiveForm(IdentityForms.SingleCredential)}
              type={BtnTypes.senary}
            >
              {strings.SINGLE_CREDENTIAL}
            </Btn>
            <Btn
              onPress={() => animateActiveForm(IdentityForms.BusinessCard)}
              type={BtnTypes.senary}
            >
              {strings.BUSINESS_CARD}
            </Btn>
          </>
        )}
        {activeForm === IdentityForms.SingleCredential && (
          <>
            <JoloText>SingleCredential form</JoloText>
            <Btn onPress={() => animateActiveForm(null)} type={BtnTypes.senary}>
              {strings.RESET}
            </Btn>
          </>
        )}
        {activeForm === IdentityForms.BusinessCard && (
          <>
            <JoloText>BusinessCard form</JoloText>
            <Btn onPress={() => animateActiveForm(null)} type={BtnTypes.senary}>
              {strings.RESET}
            </Btn>
          </>
        )}
      </TopSheet>
    </ScreenContainer>
  )
}

export default Identity
