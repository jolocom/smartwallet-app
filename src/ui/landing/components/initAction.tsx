import * as React from 'react'
import { Block, CenteredText, Container } from '../../structure'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-material-ui'
import { JolocomTheme } from '../../../styles/jolocom-theme'
import * as I18n from 'i18n-js'
import strings from '../../../locales/strings'

const styles = StyleSheet.create({
  mainContainerStyle: {
    padding: 0,
    backgroundColor: '#05050d',
  },
  selectorContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionSelector: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ffdebc',
    paddingHorizontal: 40,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: 'rgba(148, 47, 81, 0.5)',
    borderColor: '#942f51',
  },
  title: {
    marginBottom: 10,
    fontFamily: JolocomTheme.contentFontFamily,
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
    fontFamily: JolocomTheme.contentFontFamily,
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
    title: strings.CREATE_NEW_ACCOUNT,
    subtitle: strings.IF_IT_IS_YOUR_FIRST_EXPERIENCE_OF_JOLOCOM_SMARTWALLET,
    key: 'create',
  },
  {
    title: strings.RECOVER_YOUR_DIGITAL_IDENTITY,
    subtitle: strings.IF_IT_IS_YOUR_FIRST_EXPERIENCE_OF_JOLOCOM_SMARTWALLET, //FIXME replace with correct text
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
      {options.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.actionSelector,
            selectedItem === option.key && styles.selected,
          ]}
          onPress={() => selectOption(option.key)}
        >
          <CenteredText msg={I18n.t(option.title)} style={styles.title} />
          <CenteredText msg={I18n.t(option.subtitle)} style={styles.subtitle} />
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
