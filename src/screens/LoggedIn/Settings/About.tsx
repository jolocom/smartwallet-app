import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import { JolocomLogoBig } from '~/assets/svg'
import { View, StyleSheet } from 'react-native'
import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
// @ts-ignore
import packageJson from '~/../package.json'
import useTranslation from '~/hooks/useTranslation'

const About = () => {
  const { t } = useTranslation()
  const redirectToTerms = useRedirectTo(ScreenNames.TermsOfService)
  const redirectToPrivacyPolicy = useRedirectTo(ScreenNames.PrivacyPolicy)

  const version = packageJson.version

  return (
    <ScreenContainer hasHeaderBack>
      <View style={styles.container}>
        <JoloText
          customStyles={{
            position: 'absolute',
          }}
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.middle}
        >
          {t('About.versionInfo', { version })}
        </JoloText>
        <View
          style={{
            transform: [{ scale: 0.8 }],
          }}
        >
          <JolocomLogoBig />
        </View>
      </View>
      <View style={styles.container}>
        <BtnGroup>
          <Btn onPress={redirectToTerms} type={BtnTypes.secondary}>
            {t('Terms of Service.header')}
          </Btn>
          <Btn onPress={redirectToPrivacyPolicy} type={BtnTypes.secondary}>
            {t('PrivacyPolicy.header')}
          </Btn>
        </BtnGroup>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default About
