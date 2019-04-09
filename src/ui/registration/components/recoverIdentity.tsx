import React from 'react'
import { Dimensions, StyleSheet, TextInput } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { CenteredText, Container } from 'src/ui/structure/'
import { Button } from "react-native-material-ui";
import I18n from 'src/locales/i18n'

interface Props {
  onSeedPhraseChange: (seedPhrase: string) => void,
  onSubmit: () => void,
}

const viewWidth: number = Dimensions.get('window').width

// TODO FONT WEIGHT REFERENCE FROM STYLES
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: JolocomTheme.primaryColorBlack,
    padding: 0
  },
  text: {
    position: 'absolute',
    top: '20%',
    paddingHorizontal: viewWidth / 15,
    backgroundColor: JolocomTheme.primaryColorBlack,
    fontSize: JolocomTheme.headerFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
    fontWeight: '100',
    color: JolocomTheme.primaryColorSand
  },
  buttonContainer: {
    width: 164,
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
  textInputField: {
    padding: '3%',
    color: JolocomTheme.primaryColorWhite,
    fontSize: 22,
    fontWeight: '100',
    fontFamily: JolocomTheme.contentFontFamily,
    width: '80%',
  },
})

export const RecoverIdentityComponent: React.SFC<Props> = props => {
  const { onSeedPhraseChange, onSubmit } = props
  return (
    <Container style={ styles.mainContainer }>
      <CenteredText
        style={ styles.text }
        msg={ 'Please input your seed phrase' }
      />
      <TextInput
        style={styles.textInputField}
        onChangeText={ onSeedPhraseChange }
        underlineColorAndroid={JolocomTheme.primaryColorPurple}
      />
      <Button
        style={{ container: styles.buttonContainer, text: styles.buttonText }}
        text={ I18n.t('Submit') }
        onPress={ onSubmit }
      />
    </Container>
  )
}
