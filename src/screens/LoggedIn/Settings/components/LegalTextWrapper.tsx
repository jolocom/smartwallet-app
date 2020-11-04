import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { useState } from 'react'
import { ConsentText } from './ConsentText'
import ConsentButton from './ConsentTextButton'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface Props {
  locale: string
  enText: string
  deText: string
  title: string
}

const LegalTextWrapper: React.FC<Props> = ({
  locale,
  title,
  enText,
  deText,
  children,
}) => {
  const legalText = locale === 'en' ? enText : deText
  const [toggleGerman, setToggleGerman] = useState(false)

  const renderGermanToggle = () => {
    if (locale !== 'de') {
      return toggleGerman ? (
        <ConsentText text={deText} onPress={() => setToggleGerman(false)} />
      ) : (
        <ConsentButton
          text={strings.DE_VERSION}
          onPress={() => setToggleGerman(true)}
        />
      )
    }

    return null
  }

  return (
    <ScreenContainer hasHeaderBack customStyles={{ paddingTop: 24 }}>
      <View style={styles.wrapper}>
        <JoloText
          color={Colors.white90}
          kind={JoloTextKind.title}
          size={JoloTextSizes.middle}
          customStyles={{ marginBottom: 22 }}
        >
          {title}
        </JoloText>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: '20%',
          }}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <JoloText
            color={Colors.white80}
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            customStyles={{ textAlign: 'left', opacity: 0.8 }}
          >
            {legalText}
          </JoloText>
          {renderGermanToggle()}
          {children}
        </ScrollView>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
})

export default LegalTextWrapper
