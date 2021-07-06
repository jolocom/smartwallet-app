import React, { useState } from 'react'
import { Image, LayoutAnimation, StyleSheet, View } from 'react-native'
import Fallin from '~/components/animation/Fallin'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

import SingleCredentialWizard from './SingleCredentialWizard'
import { IdentityTabIds } from './types'
import useTranslation from '~/hooks/useTranslation'

enum IdentityForms {
  SingleCredential = 'SingleCredential',
}

interface Props {
  onSubmit: (id: IdentityTabIds) => void
}
const WelcomeSheet: React.FC<Props> = ({ onSubmit }) => {
  const [isTopSheetVisible, setTopSheetVisibility] = useState(true)
  const [activeForm, setActiveForm] = useState<IdentityForms | null>(null)
  const { t } = useTranslation()

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

  const handleSubmit = (id: IdentityTabIds) => {
    onSubmit(id)
    changeActiveForm(null)
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
          <SingleCredentialWizard
            onFormSubmit={() => handleSubmit(IdentityTabIds.credentials)}
          />
        ) : (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              paddingTop: 32,
            }}
          >
            <Image source={require('~/assets/images/identityIntro.png')} />
            <JoloText
              kind={JoloTextKind.title}
              color={Colors.white90}
              customStyles={{
                marginTop: 20,
                marginBottom: BP({
                  large: 48,
                  medium: 48,
                  small: 24,
                  xsmall: 12,
                }),
              }}
            >
              {t('Identity.widgetWelcome')}
            </JoloText>

            <Btn
              onPress={() => changeActiveForm(IdentityForms.SingleCredential)}
              type={BtnTypes.senary}
              customContainerStyles={{ backgroundColor: Colors.mainBlack }}
              testID="single-credential-button"
            >
              {t('Identity.widgetStartBtn')}
            </Btn>
          </View>
        )}
      </View>
    </Fallin>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.lightBlack,
    padding: BP({ large: 28, default: 24 }),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
})

export default WelcomeSheet
