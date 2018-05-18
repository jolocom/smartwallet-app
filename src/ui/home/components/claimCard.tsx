import React from 'react'
import { ListItem } from 'react-native-material-ui'
import { StyleSheet, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import {
  MoreIcon,
  AccessibilityIcon,
  NameIcon,
  EmailIcon,
  PhoneIcon
} from 'src/resources'

interface Props {
  openClaimDetails: (selectedType: string) => void
  claimType: string
  firstClaimLabel: string
  firstClaimValue?: string
  claimLines?: number
  secondClaimLabel?: string
  secondClaimValue?: string
}

interface IIconMap {
  [key: string]: any
}

const iconMap : IIconMap = {
  name: <NameIcon />,
  email: <EmailIcon />,
  phone: <PhoneIcon />
}

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
  const claimLines = props.claimLines === undefined ? 1 : props.claimLines
  let displayItemMenu

  if (props.firstClaimValue !== undefined ||
    claimLines === 2 && props.secondClaimValue !== undefined) {
    displayItemMenu = (<MoreIcon />)
  }

  return(
    <View style={styles.containerField}>
      <ListItem
        style={{
          primaryTextContainer: styles.listItemPrimaryTextContainer,
          primaryText: props.firstClaimValue === undefined ?
          JolocomTheme.textStyles.light.labelDisplayFieldEdit :
          JolocomTheme.textStyles.light.labelDisplayField,
          secondaryText: {
            ...props.firstClaimValue === undefined ?
            JolocomTheme.textStyles.light.textDisplayFieldEdit :
            JolocomTheme.textStyles.light.textDisplayField,
            lineHeight: 24
          },
          container: styles.listItemContainerOneLine,
          leftElementContainer: styles.listItemLeftElementContainer,
          rightElementContainer: styles.listItemRightElementContainer
        }}
        centerElement={{
          primaryText: stringCapitalize(props.firstClaimLabel),
          secondaryText: props.firstClaimValue === undefined ?
          '+ add' :
          props.firstClaimValue
        }}
        leftElement={
          iconMap[props.claimType] === undefined ?
            <AccessibilityIcon /> :
            iconMap[props.claimType]
        }
        onPress={() => {}}
        rightElement={ displayItemMenu }
      />

      {
        claimLines === 2 ?
        <ListItem
          style={{
            primaryTextContainer: styles.listItemPrimaryTextContainer,
            primaryText: props.secondClaimValue === undefined ?
            JolocomTheme.textStyles.light.labelDisplayFieldEdit :
            JolocomTheme.textStyles.light.labelDisplayField,
            secondaryText: {
              ...props.secondClaimValue === undefined ?
              JolocomTheme.textStyles.light.textDisplayFieldEdit :
              JolocomTheme.textStyles.light.textDisplayField,
              lineHeight: 24
            },
            container: styles.listItemContainerTwoLines
          }}
          centerElement={{
            primaryText: props.secondClaimLabel !== undefined ?
              stringCapitalize(props.secondClaimLabel) : 'Attribute',
            secondaryText: props.secondClaimValue === undefined ?
            '+ add' :
            props.secondClaimValue
          }}
          onPress={() => {}}
        /> :
        null
      }
    </View>
  )
}

const stringCapitalize = (myString : string) : string => {
  return myString[0].toUpperCase() + myString.slice(1)
}
