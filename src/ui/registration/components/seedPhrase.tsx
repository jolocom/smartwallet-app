import * as React from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'
import { JolocomTheme } from '../../../styles/jolocom-theme'
import { Container } from '../../structure/container'

const { Avatar, Checkbox, Button } = require('react-native-material-ui')
const techGuyImg = require('../../../img/img_techguy.png')

export interface Props {
  seedPhrase: string;
  checked: boolean;
  onCheck: () => void;
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flex: 1,
    width: '100%'
  },
  title: {
    flex: 1,
    color: JolocomTheme.textStyles.subheadline.color,
    fontWeight: JolocomTheme.textStyles.subheadline.fontWeight,
    fontSize: JolocomTheme.textStyles.sectionheader.fontSize,
    textAlign: 'center'
  },
  avatarImage: {
    width: 60,
    height: 60
  },
  avatarContainer: {
    flex: 1,
    display: 'flex',
    justifyContent:'center'
  },
  phrase: {
    flex: 1,
    width: '100%',
    color: JolocomTheme.textStyles.sectionheader.color,
    fontWeight: JolocomTheme.textStyles.sectionheader.fontWeight,
    fontSize: JolocomTheme.textStyles.sectionheader.fontSize,
    textAlign: 'center'
  },
  sideNoteGreen: {
    flex: 1,
    color: JolocomTheme.palette.primary1Color,
    fontSize: JolocomTheme.textStyles.textCopy.fontSize,
    textAlign: 'center'
  }
})

const muiStyles = {
  button: {
    container: {
      backgroundColor: JolocomTheme.palette.primaryColor
    },
  },
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

export const SeedPhrase : React.SFC<Props> = (props) => {
  return(
    <Container>
      <View style={styles.avatarContainer}>
        <Image
          style={ styles.avatarImage }
          source={ techGuyImg }
        />
      </View>
      <Text style={styles.title}>
        Your secure phrase
      </Text>
      <Text style={styles.phrase}>
        {props.seedPhrase}
      </Text>
      <Text style={styles.sideNoteGreen}>
        IMPORTANT {'\n'}
        Write these words down on an analog and secure place. Store it in at
        least two different places. Without these words you cannot access
        your wallet again.
        Anyone with these words can get access to your wallet.
        Taking a screenshot is not secure.
      </Text>
      <View style={ styles.checkboxContainer }>
        <Checkbox
          style={ muiStyles.checkbox }
          onCheck={ props.onCheck } 
          label='Yes, I have securely written down my phrase.'
          value=''
          checkedIcon='radio-button-checked'
          uncheckedIcon='radio-button-unchecked'
          checked={props.checked}
        />
      </View>
      <View style={{ flex: 1}}>
        <Button
          style={ props.checked ? muiStyles.button : {} }
          disabled={ !props.checked }
          raised
          primary
          text='NEXT STEP'
        />
      </View>
    </Container>
  )
}
