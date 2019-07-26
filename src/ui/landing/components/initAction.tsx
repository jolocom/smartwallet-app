import * as React from 'react'
import { Block, CenteredText, Container } from '../../structure'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-material-ui'
import { JolocomTheme } from '../../../styles/jolocom-theme.android'

const styles = StyleSheet.create({
  mainContainerStyle: {
    padding: 0,
    backgroundColor: '#05050d',
  },
  selectorContainer: {
    margin: 50,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  actionSelector: {
    flex: 1,
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ffdebc',
    margin: 30,
    paddingRight: 40,
    paddingLeft: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#942F51',
  },
  title: {
    marginBottom: 10,
    fontFamily: 'TTCommons',
    fontSize: 28,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 31,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffefdf',
  },
  subtitle: {
    opacity: 0.75,
    fontFamily: 'TTCommons',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffefdf',
  },
  buttonBlock: {
    marginBottom: 30,
    flex: 0.1,
  },
  buttonContainer: {
    height: 48,
    minWidth: 164,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
    textAlign: 'center',
    minWidth: 158,
  },
  disabled: {
    opacity: 0.5,
  },
})

interface InitActionProps {
  selectedItem: string
  selectOption: (key: string) => void
  handleButtonTap: () => void
}

const options = [
  {
    title: 'create new account',
    subtitle: 'if it is your first experience of Jolocom SmartWallet',
    key: 'create',
  },
  {
    title: 'recover your digital identity',
    subtitle: 'if it is your first experience of Jolocom SmartWallet',
    key: 'recover',
  },
]

const InitActionComponent = ({
  selectedItem,
  selectOption,
  handleButtonTap,
}: InitActionProps) => (
  <Container style={styles.mainContainerStyle}>
    <Block style={styles.selectorContainer}>
      {options.map(option => (
        <TouchableOpacity
          style={[
            styles.actionSelector,
            selectedItem === option.key && styles.selected,
          ]}
          onPress={() => selectOption(option.key)}
        >
          <CenteredText msg={option.title} style={styles.title} />
          <CenteredText msg={option.subtitle} style={styles.subtitle} />
        </TouchableOpacity>
      ))}
    </Block>
    <Block style={styles.buttonBlock}>
      <Button
        disabled={!selectedItem}
        raised
        onPress={handleButtonTap}
        style={{
          container: [styles.buttonContainer, !selectedItem && styles.disabled],
          text: [styles.buttonText, !selectedItem && styles.disabled],
        }}
        upperCase={false}
        text={'Continue'}
      />
    </Block>
  </Container>
)
export default InitActionComponent
