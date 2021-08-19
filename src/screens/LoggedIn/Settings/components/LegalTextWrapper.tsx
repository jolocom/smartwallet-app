import React from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { useState } from 'react'
import { ConsentText } from './ConsentText'
import ConsentButton from './ConsentTextButton'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import CollapsibleClone from '~/components/CollapsibleClone'
import Section from './Section'
import { NavHeaderType } from '~/components/NavigationHeader'

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
          text={'DE Version'}
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
        renderHeader={() => (
          <CollapsibleClone.Header type={NavHeaderType.Back} />
        )}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <CollapsibleClone.Scroll
              containerStyles={{
                paddingBottom: '30%',
              }}
            >
              <CollapsibleClone.Title text={title}>
                <Section.Title
                  customStyle={{ marginBottom: 16, marginTop: 16 }}
                >
                  {title}
                </Section.Title>
              </CollapsibleClone.Title>
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
