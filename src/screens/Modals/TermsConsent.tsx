import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import {
  termsOfServiceEN,
  termsOfServiceDE,
  privacyPolicyEN,
  privacyPolicyDE,
} from '~/translations/terms'
import { strings } from '~/translations/strings'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import BottomSheet from '~/components/BottomSheet'
import Btn from '~/components/Btn'
import ConsentButton from '~/screens/LoggedIn/Settings/components/ConsentTextButton'
import { ConsentText } from '~/screens/LoggedIn/Settings/components/ConsentText'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { CheckmarkIconSmall } from '~/assets/svg'
import useTermsConsent from '~/hooks/consent'
import { useAgent } from '~/hooks/sdk'
import { useToggleExpand } from '~/hooks/ui'

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
      <ConsentButton text={title} onPress={onToggleExpand} />
      {isExpanded && <ConsentText text={content} onPress={onToggleExpand} />}
    </>
  )
}

const TermsConsent: React.FC = () => {
  const agent = useAgent()
  const { acceptConsent } = useTermsConsent()

  const [accepted, setAccepted] = useState(false)

  return (
    <ScreenContainer customStyles={{ paddingHorizontal: 0, paddingTop: 20 }}>
      <View style={styles.header}>
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.middle}
          color={Colors.white85}
          customStyles={{ textAlign: 'left' }}
        >
          {
            strings.SMARTWALLET_INTRODUCING_TERMS_AND_CONDITIONS_AND_PRIVACY_POLICY
          }
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
            {
              strings.YOU_CAN_FIND_THE_GERMAN_AND_ENGLISH_VERSION_OF_THE_DOCUMENTS_BELOW
            }
          </JoloText>
          {legalTextConfig.map(({ title, content }) => {
            return <ExpandingButton title={title} content={content} />
          })}
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
              {
                strings.I_UNDERSTAND_AND_ACCEPT_THE_TERMS_OF_SERVICE_AND_PRIVACY_POLICY
              }
            </JoloText>
          </View>
        </TouchableOpacity>
        <Btn
          customContainerStyles={{ width: '100%' }}
          onPress={() => acceptConsent(agent)}
          disabled={!accepted}
        >
          {strings.ACCEPT_NEW_TERMS}
        </Btn>
      </BottomSheet>
    </ScreenContainer>
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
