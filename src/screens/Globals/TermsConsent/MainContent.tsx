import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import Option from '~/screens/LoggedIn/Settings/components/Option'
import Section from '~/screens/LoggedIn/Settings/components/Section'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Btn from '~/components/Btn'
import BottomSheet from '~/components/BottomSheet'
import useTermsConsent from '~/hooks/consent'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { CheckmarkIconSmall } from '~/assets/svg'
import { useAgent } from '~/hooks/sdk'
import { useGoBack } from '~/hooks/navigation'

const legalTextConfig = ['Terms of Service', 'Privacy Policy']

const MainContent: React.FC = () => {
  const [accepted, setAccepted] = useState(false)
  const { t } = useTranslation()
  const { acceptConsent } = useTermsConsent()
  const agent = useAgent()
  const navigation = useNavigation()
  const handleNavigateToScreen = navigation.navigate
  const goBack = useGoBack()

  const handleAccept = () => {
    acceptConsent(agent)
      .then(() => goBack())
      .catch((e) => console.log(e))
  }

  return (
    <ScreenContainer customStyles={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Section customStyles={{ paddingHorizontal: 20, paddingTop: 0 }}>
          <Section.Title>Terms of Service and Privacy Policy</Section.Title>
          <Section>
            <JoloText customStyles={{ textAlign: 'left' }}>
              {t('TermsConsent.subheader')}
            </JoloText>
          </Section>
          <Section>
            <Section.Block>
              {legalTextConfig.map((legalText) => {
                return (
                  <Option
                    key={legalText}
                    onPress={() => handleNavigateToScreen(legalText)}
                  >
                    <Option.Title title={legalText} />
                    <Option.RightIcon />
                  </Option>
                )
              })}
            </Section.Block>
          </Section>
        </Section>
        <BottomSheet showSlide={true} customStyles={styles.bottomBar}>
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
        </BottomSheet>
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    paddingTop: 14,
    paddingBottom: 26,
    paddingHorizontal: 20,
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
