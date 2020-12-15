import React, { useState } from 'react'
import { Image, LayoutAnimation } from 'react-native'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'

import ScreenContainer from '~/components/ScreenContainer'
import TopSheet from '~/components/TopSheet'
import BusinessCardWizard from '~/components/Wizard/BusinessCardWizard'
import SingleCredentialWizard from '~/components/Wizard/SingleCredentialWizard'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'

enum IdentityForms {
  SingleCredential = 'SingleCredential',
  BusinessCard = 'BusinessCard',
}

const Identity = () => {
  const [isTopSheetVisible, setTopSheetVisibility] = useState(true)
  const [activeForm, setActiveForm] = useState<IdentityForms | null>(null)

  const animateActiveForm = (form: IdentityForms | null) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      create: {
        ...LayoutAnimation.Presets.easeInEaseOut.create,
        duration: 200,
      },
      delete: {
        ...LayoutAnimation.Presets.easeInEaseOut.delete,
        duration: 100,
      },
      duration: 400,
    })
    setActiveForm(form)
  }

  return (
    <ScreenContainer isFullscreen>
      <TopSheet
        // isVisible={Boolean(Object.keys(attributes).length)}
        isVisible={isTopSheetVisible}
        customStyles={{ alignItems: 'center' }}
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
          <SingleCredentialWizard
            onFormSubmit={() => animateActiveForm(null)}
          />
        )}
        {activeForm === IdentityForms.BusinessCard && (
          <BusinessCardWizard onFormSubmit={() => animateActiveForm(null)} />
        )}
      </TopSheet>
    </ScreenContainer>
  )
}

export default Identity
