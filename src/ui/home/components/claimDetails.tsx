import React from 'react'
import { ScrollContainer, Block, CenteredText } from 'src/ui/structure'
import {
  StyleSheet,
  Keyboard,
  EmitterSubscription,
  Dimensions,
} from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'
import I18n from 'src/locales/i18n'

const viewHeight: number = Dimensions.get('window').height

const styles = StyleSheet.create({
  blockSpace: {
    marginTop: viewHeight / 40,
    marginBottom: viewHeight / 40,
  },
  blockSpaceLast: {
    marginTop: viewHeight / 20,
    marginBottom: viewHeight / 20,
  },
  buttonContainer: {
    width: 164,
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonContainerDisabled: {
    width: 164,
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.disabledButtonBackgroundGrey,
  },
  buttonText: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
  buttonTextDisabled: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.disabledButtonTextGrey,
    fontWeight: '100',
  },
})

interface Props {
  selectedClaim: DecoratedClaims
  handleClaimInput: (fieldName: string, fieldValue: string) => void
  saveClaim: () => void
}

interface State {
  pending: boolean
  keyboardDrawn: boolean
}

export class ClaimDetailsComponent extends React.Component<Props, State> {
  private kbShowListener!: EmitterSubscription
  private kbHideListener!: EmitterSubscription

  state = {
    pending: false,
    keyboardDrawn: false,
  }

  componentDidMount() {
    this.setupListeners()
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  private setupListeners(): void {
    this.kbShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({ keyboardDrawn: true }),
    )

    this.kbHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({ keyboardDrawn: false }),
    )
  }

  private removeListeners(): void {
    this.kbShowListener.remove()
    this.kbHideListener.remove()
  }

  private onSubmit = () => {
    Keyboard.dismiss()
    this.setState({ pending: true })
    this.props.saveClaim()
  }

  private handleFieldInput = (fieldValue: string, fieldName: string) => {
    this.props.handleClaimInput(fieldValue, fieldName)
  }

  private renderInputFields = (claimData: ClaimEntry) =>
    Object.keys(claimData).map(item => (
      <TextInputField
        key={item}
        fieldName={item}
        fieldValue={claimData[item]}
        handleFieldInput={this.handleFieldInput}
      />
    ))

  private confirmationEligibilityCheck = () =>
    !this.allDataCompleted || this.state.pending

  get allDataCompleted() {
    const { claimData } = this.props.selectedClaim
    return Object.keys(claimData).every((c, idx, arr) => {
      const fieldName = c.replace(/[0-9]/g, '')
      const isMultiLineField = arr.some(
        field => field !== c && field.replace(/[0-9]/g, '') === fieldName,
      )

      if (isMultiLineField) {
        const fieldsToCheck = arr.filter(field => field.includes(fieldName))

        return fieldsToCheck.some(field => claimData[field].length > 0)
      }

      return claimData[c].length > 0
    })
  }

  render() {
    const { credentialType, claimData } = this.props.selectedClaim
    const showButtonWhileTyping =
      !this.state.keyboardDrawn || Object.keys(claimData).length < 3

    return (
      <ScrollContainer>
        <Block style={styles.blockSpace}>
          <CenteredText
            style={JolocomTheme.textStyles.light.subheader}
            msg={I18n.t(credentialType)}
          />
        </Block>
        <Block style={styles.blockSpace}>
          {this.renderInputFields(claimData)}
        </Block>
        <Block style={styles.blockSpaceLast}>
          {showButtonWhileTyping ? (
            <Button
              onPress={() => this.onSubmit()}
              upperCase={false}
              text={I18n.t('Add claim')}
              style={
                !!this.confirmationEligibilityCheck()
                  ? {
                      container: styles.buttonContainerDisabled,
                      text: styles.buttonTextDisabled,
                    }
                  : {
                      container: styles.buttonContainer,
                      text: styles.buttonText,
                    }
              }
              disabled={!!this.confirmationEligibilityCheck()}
            />
          ) : null}
        </Block>
      </ScrollContainer>
    )
  }
}
