import React, { useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { CheckmarkIconSmall } from '~/assets/svg'
import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTermsConsent from '~/hooks/consent'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import Option from '~/screens/LoggedIn/Settings/components/Option'
import Section from '~/screens/LoggedIn/Settings/components/Section'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import i18n from '~/translations/i18n'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'

const legalTextConfig = [
  {
    key: 'terms_of_service',
    title: i18n.t('TermsOfService.header'),
    screen: ScreenNames.ConsentTermsOfService,
  },
  {
    key: 'privacy_policy',
    title: i18n.t('PrivacyPolicy.header'),
    screen: ScreenNames.ConsentPrivacyPolicy,
  },
]

const MainContent: React.FC = () => {
  const [accepted, setAccepted] = useState(false)
  const { t } = useTranslation()
  const { acceptConsent } = useTermsConsent()
  const { scheduleErrorWarning } = useToasts()
  const agent = useAgent()
  const redirect = useRedirect()
  const goBack = useGoBack()

  const handleAccept = () => {
    acceptConsent(agent)
      .then(() => goBack())
      .catch(scheduleErrorWarning)
  }

  return (
    <ScreenContainer customStyles={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <View
        style={{ width: '100%', flex: 1, paddingHorizontal: 20, paddingTop: 0 }}
      >
        <Section.Title>{t('TermsConsent.header')}</Section.Title>
        <JoloText customStyles={{ textAlign: 'left' }}>
          {t('TermsConsent.subheader')}
        </JoloText>
        <Section.Block
          customStyles={{
            height: Platform.select({
              android: BP({ large: 110, medium: 110, default: 100 }),
              ios: 100,
            }),

            marginTop: 24,
          }}
        >
          {legalTextConfig.map((legalText) => {
            return (
              <Option
                key={legalText.key}
                onPress={() => redirect(legalText.screen)}
              >
                <Option.Title title={legalText.title} />
                <Option.RightIcon />
              </Option>
            )
          })}
        </Section.Block>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => setAccepted(!accepted)}
          style={styles.acceptWrapper}
        >
          <View style={{ flex: 0.1 }}>
            <View
              style={[
                styles.checkboxBase,
                accepted ? styles.checkboxActive : styles.checkboxInactive,
              ]}
            >
              {accepted && <CheckmarkIconSmall />}
            </View>
          </View>
          <View style={{ paddingLeft: 20, flex: 0.9 }}>
            <JoloText
              kind={JoloTextKind.subtitle}
              size={JoloTextSizes.mini}
              color={Colors.white90}
              customStyles={{ textAlign: 'left' }}
            >
              {t('TermsConsent.footer')}
            </JoloText>
          </View>
        </TouchableOpacity>
        <Btn
          customContainerStyles={{ width: '100%' }}
          onPress={handleAccept}
          disabled={!accepted}
        >
          {t('TermsConsent.footerBtn')}
        </Btn>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    paddingTop: 20,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  checkboxBase: {
    width: 28,
    height: 28,
    borderRadius: 20,
  },
  acceptWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxActive: {
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInactive: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.white,
  },
})

export default MainContent
