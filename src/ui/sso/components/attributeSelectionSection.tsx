import React from 'react'
import { StateAttributeSummary } from 'src/reducers/sso'
import { Block } from 'src/ui/structure'
import { EmailIcon, PhoneIcon, NameIcon } from 'src/resources'
import { View, Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { AttributeCard } from 'src/ui/sso/components/ssoAttributeCard'
import { areCredTypesEqual } from 'src/lib/util'

interface Props {
  attributeType: string[]
  attributes: StateAttributeSummary[]
  handleAttributeSelection: Function
}

interface State {
  selectedAttribute: string
}

// TODO horisontal flex container abstraction
const styles = StyleSheet.create({
  attributeSelectionContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: '5%',
    marginBottom: '1%'
  },
  attributeTitle: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
    fontFamily: JolocomTheme.contentFontFamily
  }
})

export class AttributeSummary extends React.Component<Props, State>{
  state = {
    selectedAttribute: ''
  }

  // TODO Screen for selecting specific verification
  // TODO When would no verifications / attribute info be available?
  private handleAttributeSelection = (attribute: string) => {
    const attributeInfo = this.props.attributes.find(attr => attr.value === attribute)

    if (!attributeInfo) {
      return
    }

    const availableVerifications = attributeInfo.verifications
    const { attributeType, handleAttributeSelection } = this.props

    switch (availableVerifications.length){
      case 0:
        alert('No verifications found, weird')
        return
      case 1:
        this.setState({selectedAttribute: attribute})
        return handleAttributeSelection(attributeType, availableVerifications[0])
      default:
        alert('More than one verification found, sending the first one for now')
        this.setState({selectedAttribute: attribute})
        return handleAttributeSelection(attributeType, availableVerifications[0])
    }
  }

  private renderAvailableAttributes = (attributes: StateAttributeSummary[]) => {
    return attributes.map(attribute =>
      <AttributeCard
        key={attribute.value}
        attributeValue={attribute.value}
        onCheck={this.handleAttributeSelection}
        checked={attribute.value === this.state.selectedAttribute}
      />
    )
  }

  // TODO Use common function instead, perhaps move to util
  // TODO Better default value
  private getNameAndIconByType(type: string[]) {
    const map = [{
      type: ['Credential', 'ProofOfEmailCredential'],
      displayName: 'Email address:',
      AttributeIcon: EmailIcon
    }, {
      type: ['Credential', 'ProofOfMobilePhoneNumberCredential'],
      displayName: 'Phone number:',
      AttributeIcon: PhoneIcon
    }, {
      type: ['Default'],
      displayName: 'Credential:',
      AttributeIcon: NameIcon
    }]

    const data =  map.find(entry => areCredTypesEqual(entry.type, type))
    return data ? data : map[2]
  }

  // TODO Icons depending on type
  // TODO Name depending on type
  render() {
    const {displayName, AttributeIcon} = this.getNameAndIconByType(this.props.attributeType)

    return (
      <Block style={ styles.attributeSelectionContainer }>
        <Block flex={0.2}>
          <AttributeIcon />
        </Block>
        <View style={{flex: 0.8}}>
          <Text style={styles.attributeTitle}> {displayName} </Text>
          { this.renderAvailableAttributes(this.props.attributes) }
        </View>
      </Block>
    )
  }
}
