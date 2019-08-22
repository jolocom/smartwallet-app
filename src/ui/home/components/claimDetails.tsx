import React from 'react'
import { ScrollContainer, Block } from 'src/ui/structure'
import {
  StyleSheet,
  Keyboard,
  EmitterSubscription,
  Dimensions,
  Text,
} from 'react-native'
import { DecoratedClaims } from 'src/reducers/account/'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Buttons, Typography, Colors } from 'src/styles'

const viewHeight: number = Dimensions.get('window').height

const styles = StyleSheet.create({
  header: {
    ...Typography.centeredText,
    ...Typography.mainText,
    color: Colors.blackMain,
  },
  blockSpace: {
    marginTop: viewHeight / 40,
    marginBottom: viewHeight / 40,
  },
  blockSpaceLast: {
    marginTop: viewHeight / 20,
    marginBottom: viewHeight / 20,
  },
  buttonContainer: {
    ...Buttons.buttonStandardContainer,
  },
  buttonContainerDisabled: {
    ...Buttons.buttonDisabledStandardContainer,
  },
  buttonText: {
    ...Buttons.buttonStandardText,
  },
  buttonTextDisabled: {
    ...Buttons.buttonDisabledStandardText,
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

  private renderInputFields = (claim: DecoratedClaims) => {
    const { claimData, keyboardType } = claim
    return Object.keys(claimData).map(item => (
      <TextInputField
        key={item}
        fieldName={item}
        fieldValue={claimData[item]}
        handleFieldInput={this.handleFieldInput}
        keyboardType={keyboardType}
      />
    ))
  }

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
    const {
      selectedClaim,
      selectedClaim: { credentialType, claimData },
    } = this.props
    const showButtonWhileTyping =
      !this.state.keyboardDrawn || Object.keys(claimData).length < 3

    return (
      <ScrollContainer>
        <Block style={styles.blockSpace}>
          <Text style={styles.header}>{I18n.t(credentialType)}</Text>
        </Block>
        <Block style={styles.blockSpace}>
          {this.renderInputFields(selectedClaim)}
        </Block>
        <Block style={styles.blockSpaceLast}>
          {showButtonWhileTyping ? (
            <Button
              onPress={() => this.onSubmit()}
              upperCase={false}
              text={I18n.t(strings.ADD_CLAIM)}
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
