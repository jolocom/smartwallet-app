import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import { JolocomLogoBig } from '~/assets/svg'
import { View } from 'react-native'
import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
// @ts-ignore
import packageJson from '~/../package.json'

const About = () => {
  const redirectToTerms = useRedirectTo(ScreenNames.TermsOfService)
  const redirectToPrivacyPolicy = useRedirectTo(ScreenNames.PrivacyPolicy)

  const version = packageJson.version

  return (
    <ScreenContainer hasHeaderBack>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <JoloText
          customStyles={{
            position: 'absolute',
          }}
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.middle}
        >
          {`You are running version ${version}`}
        </JoloText>
        <View
          style={{
            transform: [{ scale: 0.8 }],
          }}
        >
          <JolocomLogoBig />
        </View>
      </View>
      <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
        <BtnGroup>
          <Btn onPress={redirectToTerms} type={BtnTypes.secondary}>
            Terms of Service
          </Btn>
          <Btn onPress={redirectToPrivacyPolicy} type={BtnTypes.secondary}>
            Privacy Policy
          </Btn>
        </BtnGroup>
      </View>
    </ScreenContainer>
  )
}
export default About
