import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { useSelector } from 'react-redux'

import {
  termsOfServiceEN,
  termsOfServiceDE,
  privacyPolicyEN,
  privacyPolicyDE,
} from '~/translations/terms'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import BottomSheet from '~/components/BottomSheet'
import Btn from '~/components/Btn'
import ConsentButton from '~/screens/LoggedIn/Settings/components/ConsentTextButton'
import { ConsentText } from '~/screens/LoggedIn/Settings/components/ConsentText'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { CheckmarkIconSmall, ExpandArrow } from '~/assets/svg'
import useTermsConsent from '~/hooks/consent'
import { useAgent } from '~/hooks/sdk'
import { useToggleExpand } from '~/hooks/ui'
import useTranslation from '~/hooks/useTranslation'
import { getIsTermsConsentVisible } from '~/modules/account/selectors'

const legalTextConfig = [
  { title: 'Terms of Service', content: termsOfServiceEN },
  {
    title: 'Nutzungsbedingungen',
    content: termsOfServiceDE,
  },
  { title: 'Privacy Policy', content: privacyPolicyEN },
  {
    title: 'Datenschutzerklärung',
    content: privacyPolicyDE,
  },
]

const ExpandingButton: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const { isExpanded, onToggleExpand } = useToggleExpand()

  return (
    <>
      <ConsentButton text={title} onPress={onToggleExpand}>
        <View
          style={{
            marginLeft: 5,
            transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
          }}
        >
          <ExpandArrow />
        </View>
      </ConsentButton>
      {isExpanded && <ConsentText text={content} onPress={onToggleExpand} />}
    </>
  )
}

const TermsConsent: React.FC = () => {
  const { t } = useTranslation()
  const agent = useAgent()
  const { acceptConsent } = useTermsConsent()
  const isTermsConsentVisible = useSelector(getIsTermsConsentVisible)

  const [accepted, setAccepted] = useState(false)

  return (
    <Modal
      visible={isTermsConsentVisible}
      statusBarTranslucent
      animationType="fade"
      presentationStyle="overFullScreen"
    >
      <ScreenContainer customStyles={{ paddingHorizontal: 0, paddingTop: 20 }}>
        <View style={styles.header}>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.middle}
            color={Colors.white85}
            customStyles={{ textAlign: 'left' }}
          >
            {t('TermsConsent.header')}
          </JoloText>
        </View>
        <View style={styles.termsWrapper}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
          >
            <JoloText
              kind={JoloTextKind.subtitle}
              size={JoloTextSizes.middle}
              color={Colors.white80}
              customStyles={{
                textAlign: 'left',
                marginBottom: BP({ default: 32, medium: 54, large: 54 }),
              }}
            >
              {t('TermsConsent.subheader')}
            </JoloText>
            {legalTextConfig.map(({ title, content }) => (
              <ExpandingButton title={title} content={content} />
            ))}
          </ScrollView>
        </View>
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
            onPress={() => acceptConsent(agent)}
            disabled={!accepted}
          >
            {t('TermsConsent.footerBtn')}
          </Btn>
        </BottomSheet>
      </ScreenContainer>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: BP({ xsmall: 20, small: 20, default: 32 }),
    marginBottom: BP({ default: 14, medium: 22, large: 22 }),
    width: '100%',
  },
  bottomBar: {
    paddingTop: 26,
    paddingBottom: 40,
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
  termsWrapper: {
    flex: 3,
    width: '100%',
    paddingHorizontal: BP({ xsmall: 20, small: 20, default: 32 }),
  },
})

export default TermsConsent
