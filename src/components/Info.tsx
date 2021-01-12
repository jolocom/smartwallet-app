import React from 'react'
import { Colors } from '~/utils/colors'
import { View, StyleSheet } from 'react-native'
import AbsoluteBottom from './AbsoluteBottom'
import Btn, { BtnTypes } from './Btn'
import JoloText, { JoloTextKind } from './JoloText'
import { useGoBack } from '~/hooks/navigation'

interface CompoundInfo {
  Content: React.FC
  Title: React.FC
  Description: React.FC
  Highlight: React.FC
  Button: React.FC
  newline: string
}

const InfoContent: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const InfoTitle: React.FC = ({ children }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.white85}
      customStyles={{ textAlign: 'left' }}
    >
      {children}
    </JoloText>
  )
}

const InfoDescription: React.FC = ({ children }) => {
  return (
    <View
      style={{
        marginTop: 36,
      }}
    >
      <JoloText color={Colors.white} customStyles={{ textAlign: 'left' }}>
        {children}
      </JoloText>
    </View>
  )
}

const InfoHighlight: React.FC = ({ children }) => {
  return <JoloText color={Colors.white60}>{children}</JoloText>
}

const InfoButton: React.FC = ({ children }) => {
  const goBack = useGoBack()
  return (
    <AbsoluteBottom>
      <Btn type={BtnTypes.secondary} onPress={goBack}>
        {children}
      </Btn>
    </AbsoluteBottom>
  )
}

const Info: CompoundInfo = {
  Content: InfoContent,
  Title: InfoTitle,
  Description: InfoDescription,
  Highlight: InfoHighlight,
  Button: InfoButton,
  newline: '\n\n',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%',
    flex: 1,
  },
})

export default Info
