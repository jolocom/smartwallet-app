import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { useState } from 'react'
import { ConsentText } from './ConsentText'
import ConsentButton from './ConsentTextButton'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'

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
}) => {
  const legalText = locale === 'en' ? enText : deText
  const [toggleGerman, setToggleGerman] = useState(false)

  const renderGermanToggle = () => {
    if (locale === 'en') {
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
    <ScreenContainer hasHeaderBack>
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
            color={Colors.white40}
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            customStyles={{ textAlign: 'left' }}
          >
            {legalText}
          </JoloText>
          {renderGermanToggle()}
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
