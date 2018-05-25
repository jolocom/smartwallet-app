import React from 'react'
import { StyleSheet, TextStyle } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Container, Block, CenteredText } from 'src/ui/structure/'

const { Checkbox, Button } = require('react-native-material-ui')
import { Techguy } from 'src/resources'

interface Props {
  seedPhrase: string
  checked: boolean
  onCheck: () => void
  handleButtonTap: () => void
}

const styles = StyleSheet.create({
  title: {
    color: JolocomTheme.textStyles.subheadline.color,
    fontWeight: JolocomTheme.textStyles.subheadline.fontWeight,
    fontSize: JolocomTheme.textStyles.sectionheader.fontSize
  } as TextStyle,
  phrase: {
    color: JolocomTheme.textStyles.sectionheader.color,
    fontWeight: JolocomTheme.textStyles.sectionheader.fontWeight,
    fontSize: JolocomTheme.textStyles.sectionheader.fontSize
  } as TextStyle,
  sideNoteGreen: {
    color: JolocomTheme.palette.primary1Color,
    fontSize: JolocomTheme.textStyles.textCopy.fontSize,
  } as TextStyle
})

const muiStyles = {
  checkbox: {
    label: {
      marginLeft: -5,
      padding: 0,
      position: 'relative',
      textAlign: 'left',
      color: JolocomTheme.textStyles.textCopy.color,
      fontSize: JolocomTheme.textStyles.textCopy.fontSize,
      fontWeight: JolocomTheme.textStyles.textCopy.fontWeight
    },
    icon: {
      color: JolocomTheme.palette.primary1Color,
    }
  }
}

export const SeedPhrase : React.SFC<Props> = props => {
  return(
    <Container>
      <Block flex={ 0.1 }>
        <Techguy height={80} width={80} />
      </Block>
      <Block flex={ 0.1 }>
        <CenteredText
          msg={ 'Your secure phrase is:' }
          style={ styles.title }
        />
      </Block>
      <Block flex={ 0.1 }>
        <CenteredText
          style={ styles.phrase }
          msg={ props.seedPhrase }
        />
      </Block>
      <Block flex={ 0.2 }>
        <CenteredText
          style={ styles.sideNoteGreen }
          msg={'IMPORTANT \n Write these words down on an analog and' +
            'secure place. Store it in at least two different places.' +
            'Without these words you cannot access your wallet again.' +
            'Anyone with these words can get access to your wallet. ' +
            'Taking a screenshot is not secure.'
          }
        />
      </Block>
      <Block flex={ 0.1 }>
        <Checkbox
          style={ muiStyles.checkbox }
          onCheck={ props.onCheck }
          label='Yes, I have securely written down my phrase.'
          checkedIcon='radio-button-checked'
          uncheckedIcon='radio-button-unchecked'
          value=''
          checked={props.checked}
        />
      </Block>
      <Block flex={ 0.1 }>
        <Button
          disabled={ !props.checked }
          onPress= { props.handleButtonTap }
          raised
          primary
          text='NEXT STEP'
        />
      </Block>
    </Container>
  )
}
