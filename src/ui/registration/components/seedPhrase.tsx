import React from 'react'
import { StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Container, Block, CenteredText } from 'src/ui/structure/'

const { Checkbox, Button } = require('react-native-material-ui')
import { Landing00 } from 'src/resources'

interface Props {
  seedPhrase: string;
  checked: boolean;
  onCheck: () => void;
}

const styles = StyleSheet.create({
  title: {
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.headerFontSize
  },
  phrase: {
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.headerFontSize
  },
  sideNoteGreen: {
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.headerFontSize
  }
})

const muiStyles = {
  button: {
    container: {
      backgroundColor: JolocomTheme.primaryColorBlack
    },
  },
  checkbox: {
    label: {
      marginLeft: -5,
      padding: 0,
      position: 'relative',
      textAlign: 'left',
      color: JolocomTheme.primaryColorPurple,
      fontSize: JolocomTheme.labelFontSize,
    },
    icon: {
      color: JolocomTheme.primaryColorSand
    }
  }
}

export const SeedPhrase : React.SFC<Props> = props => {
  return(
    <Container>
      <Block flex={ 0.1 }>
        <Landing00 height={80} width={80} />
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
          raised
          primary
          text='NEXT STEP'
        />
      </Block>
    </Container>
  )
}
