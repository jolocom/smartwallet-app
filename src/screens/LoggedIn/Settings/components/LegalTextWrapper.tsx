import React from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { useState } from 'react'
import { ConsentText } from './ConsentText'
import ConsentButton from './ConsentTextButton'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Collapsible from '~/components/Collapsible'
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
      <Collapsible
        renderHeader={() => <Collapsible.Header type={NavHeaderType.Back} />}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll
              containerStyles={{
                paddingBottom: '10%',
              }}
            >
              <Collapsible.Title text={title}>
                <Section.Title
                  customStyles={{ marginBottom: 16, marginTop: 16 }}
                >
                  {title}
                </Section.Title>
              </Collapsible.Title>
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
            </Collapsible.Scroll>
          </ScreenContainer.Padding>
        )}
      />
    </ScreenContainer>
  )
}

export default LegalTextWrapper
