import React from 'react'
import { ListItem } from 'react-native-material-ui'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'
import { ReactNode } from 'react'
import {
  MoreIcon,
  AccessibilityIcon,
  NameIcon,
  EmailIcon,
  PhoneIcon
} from 'src/resources'

interface Props {
  openClaimDetails: (claim: DecoratedClaims) => void
  claimItem: DecoratedClaims
}

const iconMap: {[key: string] : JSX.Element} = {
  'ProofOfNameCredential': <NameIcon />,
  'ProofOfEmailCredential': <EmailIcon />,
  'ProofOfMobilePhoneNumberCredential': <PhoneIcon />
}

// TODO FIX THIS
const styles = StyleSheet.create({
  containerField: {
    width: '100%',
    marginBottom: 1
  },
  listItemPrimaryTextContainer: {
    height: 21,
    top: -3
  },
  listItemLeftElementContainer: {
    height: 24,
    width: 24,
    marginTop: 20,
    marginLeft: 16,
    marginRight: 30,
    marginBottom: 35
  },
  listItemRightElementContainer: {
    height: 24,
    width: 24,
    marginTop: 16,
    marginRight: 16,
    marginBottom: 35
  },
  listItemContainerOneLine: {
    height: 79
  },
  listItemContainerTwoLines: {
    paddingLeft: 54,
    marginLeft: 0,
    height: 79
  },
  moreMenu: {
    width: '100%',
    height: '100%'
  }
})

export const ClaimCard : React.SFC<Props> = ({openClaimDetails, claimItem}) => {
  const claim = claimItem.claims[0]
  const { value, name } = claim
  const displayName = claimItem.displayName
  const type = claimItem.type[1]

  const content = []

  // TODO: Extract multi line claim card to a separate component
  if (value && name === 'name' && typeof value === 'string') {
    const splitName = value.split(' ')
    content.push({
      value: splitName[0],
      fieldName: name || '',
      type,
      label: 'First Name',
      showIcon: true
    }, {
      value: splitName[1],
      fieldName: name || '',
      type,
      label: 'Last Name',
      showIcon: false
    })
  } else {
    content.push({value: value || '', fieldName: name, type, label: displayName, showIcon: true})
  }

  const renderLeftIcon = (field: string) => {
    return iconMap[field] ? iconMap[field] : <AccessibilityIcon />  
  }

  const renderMoreMenu = () => {
    return (
      <TouchableOpacity
        style={ styles.moreMenu }
        onPress={ () => openClaimDetails(claimItem) }>
        <MoreIcon />
      </TouchableOpacity>
    )
  }

  const renderCard = (claimVal: string, fieldName: string, type: string, label: string, showIcon: boolean) : ReactNode => {
    const {
      labelDisplayFieldEdit,
      labelDisplayField,
      textDisplayFieldEdit,
      textDisplayField
    } = JolocomTheme.textStyles.light

    console.log(claimItem)

    return (
      <ListItem
        key={ fieldName }
        style={{
          primaryTextContainer: styles.listItemPrimaryTextContainer,
          primaryText: claimVal ? labelDisplayField: labelDisplayFieldEdit,
          secondaryText: {
            ...claimVal ? textDisplayField : textDisplayFieldEdit,
            lineHeight: 24
          },
          container: showIcon ? styles.listItemContainerOneLine : styles.listItemContainerTwoLines,
          leftElementContainer: styles.listItemLeftElementContainer,
          rightElementContainer: styles.listItemRightElementContainer
        }}
        centerElement={{
          primaryText: prepareLabel(label),
          secondaryText: claimVal ? claimVal : '+ add'
        }}
        leftElement={ showIcon ? renderLeftIcon(type) : '' }
        onPress={ claimVal ? undefined : () =>  openClaimDetails(claimItem)}
        rightElement={ claimVal && showIcon ? renderMoreMenu() : '' }
      />
    )
  }

  return(
    <View style={ styles.containerField }>
      { content.map((c, index) => {
        return renderCard(c.value, c.fieldName, c.type, c.label, c.showIcon)
      }) }
    </View>
  )
}

const prepareLabel = (myString : string) : string => {
  const matches = myString.match(/[A-Z]/g)
  if (matches) {
    matches.map((match) => {
      const index = myString.indexOf(match)
      const tx = myString.slice(0, index) + " " + myString.slice(index)
      myString = tx
    })
  }
  return myString[0].toUpperCase() + myString.slice(1)
}
