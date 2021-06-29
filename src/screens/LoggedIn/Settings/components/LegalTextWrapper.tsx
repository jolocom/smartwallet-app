import React from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { useState } from 'react'
import { ConsentText } from './ConsentText'
import ConsentButton from './ConsentTextButton'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import CollapsibleClone from '~/components/CollapsibleClone'

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
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <CollapsibleClone
        renderHeader={() => <CollapsibleClone.Header />}
        renderScroll={({ headerHeight }) => (
          <ScreenContainer.Padding>
            <CollapsibleClone.Scroll
              contentContainerStyle={{
                paddingTop: headerHeight,
                paddingBottom: '30%',
              }}
            >
              <CollapsibleClone.Title text={title} />
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
            </CollapsibleClone.Scroll>
          </ScreenContainer.Padding>
        )}
      />
    </ScreenContainer>
  )
}

export default LegalTextWrapper
