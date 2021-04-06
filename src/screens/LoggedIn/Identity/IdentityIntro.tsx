import React, { useState } from 'react'
import { Image, LayoutAnimation, StyleSheet, View } from 'react-native'
import Fallin from '~/components/animation/Fallin'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'

import SingleCredentialWizard from './SingleCredentialWizard'
import BusinessCardWizard from './BusinessCardWizard'

enum IdentityForms {
  SingleCredential = 'SingleCredential',
  BusinessCard = 'BusinessCard',
}

const WelcomeSheet: React.FC = () => {
  const [isTopSheetVisible, setTopSheetVisibility] = useState(true)
  const [activeForm, setActiveForm] = useState<IdentityForms | null>(null)

  const animateSheet = () =>
    LayoutAnimation.configureNext({
      update: {
        ...LayoutAnimation.Presets.linear.update,
        duration: 200,
      },
      create: {
        ...LayoutAnimation.Presets.linear.create,
        duration: 200,
      },
      delete: {
        ...LayoutAnimation.Presets.linear.delete,
        duration: 100,
      },
      duration: 400,
    })

  const changeActiveForm = (form: IdentityForms | null) => {
    if (form) {
      animateSheet()
      setActiveForm(form)
    } else {
      setTopSheetVisibility(false)
    }
  }

  const handleWidgetReset = () => {
    animateSheet()
    setActiveForm(null)
  }

  return (
    <Fallin
      isFallingIn={isTopSheetVisible}
      from="top"
      onDismiss={handleWidgetReset}
    >
      <View style={styles.container}>
        {activeForm === IdentityForms.SingleCredential ? (
          <SingleCredentialWizard onFormSubmit={() => changeActiveForm(null)} />
        ) : activeForm === IdentityForms.BusinessCard ? (
          <BusinessCardWizard onFormSubmit={() => changeActiveForm(null)} />
        ) : (
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
              onPress={() => changeActiveForm(IdentityForms.SingleCredential)}
              type={BtnTypes.senary}
              testID="single-credential-button"
            >
              {strings.SINGLE_CREDENTIAL}
            </Btn>
            <Btn
              onPress={() => changeActiveForm(IdentityForms.BusinessCard)}
              type={BtnTypes.senary}
              testID="business-card-button"
            >
              {strings.BUSINESS_CARD}
            </Btn>
          </>
        )}
      </View>
    </Fallin>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.lightBlack,
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
})

export default WelcomeSheet
