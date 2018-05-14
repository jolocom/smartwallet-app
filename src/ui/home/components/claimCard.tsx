import React from 'react'
import { ListItem } from 'react-native-material-ui'
import { Text, StyleSheet, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'


interface Props {
  openClaimDetails: (selectedType: string) => void
  claimType: string
  icon: string
  firstClaimLabel: string
  firstClaimValue?: string
  claimLines?: number
  secondClaimLabel?: string
  secondClaimValue?: string
}

const styles = StyleSheet.create({
  containerField: {
    width: '100%'
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
    marginTop: 20,
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
    // TODO: replace with icon for item menu + functionality
    displayItemMenu = (<Text onPress={
      () => console.log('right element pressed')
    }>M</Text>)
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
          primaryText: props.firstClaimLabel,
          secondaryText: props.firstClaimValue === undefined ?
          '+ add' :
          props.firstClaimValue
        }}
        leftElement={ props.icon }
        onPress={() => props.openClaimDetails(props.claimType)}
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
              props.secondClaimLabel : 'Placeholder',
            secondaryText: props.secondClaimValue === undefined ?
            '+ add' :
            props.secondClaimValue
          }}
          onPress={() => props.openClaimDetails(props.claimType)}
        /> :
        null
      }
    </View>
  )
}
