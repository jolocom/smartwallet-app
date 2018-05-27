import React from 'react'
import { ListItem } from 'react-native-material-ui'
import { StyleSheet, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { IClaimUI } from 'src/ui/home/components/claimOverview'
import {
  MoreIcon,
  AccessibilityIcon,
  NameIcon,
  EmailIcon,
  PhoneIcon
} from 'src/resources'

interface Props {
  openClaimDetails: (selectedType: string) => void
  claimItem: IClaimUI
}

interface IIconMap {
  [key: string]: any
}

const iconMap : IIconMap = {
  name: <NameIcon />,
  email: <EmailIcon />,
  telephone: <PhoneIcon />
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
    width: 12,
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
  }
})

export const ClaimCard : React.SFC<Props> = (props) => {
  const { claimValue, claimField } = props.claimItem
  let content = []

  if (claimField === 'name' && claimValue !== undefined) {
    const splitName = claimValue.split(' ')
    content.push({
      claimValue: splitName[0],
      claimField,
      label: 'firstName',
      showIcon: true
    }, {
      claimValue: splitName[1],
      claimField,
      label: 'lastName',
      showIcon: false
    })
  } else {
    content.push({
      claimValue,
      claimField,
      label: claimField,
      showIcon: true
    })
  }

  const renderLeftIcon = (claimField: string, showIcon: boolean) => {
    if (!showIcon) {
      return ''
    } else if (iconMap[claimField] !== undefined) {
      return iconMap[claimField]
    } else if (iconMap[claimField] === undefined) {
      return <AccessibilityIcon />
    }
  }

  const renderCard = (claimVal: any, claimField: string, label: string, showIcon: boolean) => {
    const {
      labelDisplayFieldEdit,
      labelDisplayField,
      textDisplayFieldEdit,
      textDisplayField
    } = JolocomTheme.textStyles.light

    return (
      <ListItem
        key={ label }
        style={{
          primaryTextContainer: styles.listItemPrimaryTextContainer,
          primaryText: claimVal === undefined ? labelDisplayFieldEdit : labelDisplayField,
          secondaryText: {
            ...claimVal === undefined ? textDisplayFieldEdit : textDisplayField,
            lineHeight: 24
          },
          container: showIcon ? styles.listItemContainerOneLine : styles.listItemContainerTwoLines,
          leftElementContainer: styles.listItemLeftElementContainer,
          rightElementContainer: styles.listItemRightElementContainer
        }}
        centerElement={{
          primaryText: stringCapitalize(label),
          secondaryText: claimVal === undefined ?
          '+ add' :
          claimVal
        }}
        leftElement={ renderLeftIcon(claimField, showIcon) }
        onPress={() => {}}
        rightElement={ claimVal !== undefined ? <MoreIcon /> : '' }
      />
    )
  }

  return(
    <View style={ styles.containerField }>
      { content.map((c) => {
        return renderCard(c.claimValue, c.claimField, c.label, c.showIcon)
      }) }
    </View>
  )
}

const stringCapitalize = (myString : string) : string => {
  const matches = myString.match(/[A-Z]/g)
  if (matches !== null) {
    matches.map((match) => {
      const index = myString.indexOf(match)
      const tx = myString.slice(0, index) + " " + myString.slice(index)
      myString = tx
    })
  }
  return myString[0].toUpperCase() + myString.slice(1)
}
