import React, { ReactNode } from 'react'
import { View, Text, StyleSheet, GestureResponderEvent, TextStyle, ViewStyle } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// TODO Custom text component with size, font, color
// TODO Make whole card clickable as opposed to icon
// TODO Changes to the 'Container' custom component to allow horisontal flex
interface ClaimCardProps {
  rightIcon?: ReactNode
  secondaryText?: string | ReactNode
  primaryText: string | ReactNode
  primaryTextStyle?: TextStyle
  secondaryTextStyle?: TextStyle
  containerStyle?: ViewStyle
}

export const ClaimCard: React.SFC<ClaimCardProps> = props => {
  const styles = StyleSheet.create({
    primaryTextDefault: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.headerFontSize,
      color: JolocomTheme.primaryColorBlack,
      fontWeight: '100'
    },
    secondaryTextDefault: {
      fontSize: 17,
      opacity: 0.4
    },
    containerDefault: {
      flex: 1,
      marginBottom: '5%',
      justifyContent: 'flex-start'
    }
  })

  const { primaryText, secondaryText, rightIcon, primaryTextStyle, secondaryTextStyle, containerStyle } = props
  const { primaryTextDefault, secondaryTextDefault, containerDefault } = styles

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={[containerDefault, containerStyle]}>
        <Text style={[primaryTextDefault, secondaryTextDefault, secondaryTextStyle]}>{secondaryText}</Text>
        <Text style={[primaryTextDefault, primaryTextStyle]}>{primaryText}</Text>
      </View>
      {rightIcon}
    </View>
  )
}

interface EmptyClaimCardProps {
  credentialType: string
  onEdit: (e: GestureResponderEvent) => void
}

export const PlaceholderClaimCard: React.SFC<EmptyClaimCardProps> = props => (
  <ClaimCard
    key={props.credentialType}
    primaryText={<Text onPress={props.onEdit}>+ add</Text>}
    primaryTextStyle={{ color: JolocomTheme.primaryColorPurple }}
    secondaryText={<Text>{props.credentialType}</Text>}
    secondaryTextStyle={{ opacity: 1 }}
  />
)

interface ConsentAttributeCardProps {
  issuer: string
  did: string
  values: string[]
  rightIcon?: ReactNode
}

export const ConsentAttributeCard: React.SFC<ConsentAttributeCardProps> = props => {
  const renderCards = (values: string[]) => {
    if (!values.length) {
      return <ClaimCard primaryTextStyle={{ marginLeft: '20%' }} primaryText={'No local claims'} />
    }

    return values.map((value, idx, arr) => (
      <ClaimCard primaryText={value} containerStyle={{ marginBottom: 0 }} primaryTextStyle={{ marginLeft: '20%' }} />
    ))
  }

  const color = props.issuer !== props.did ? '#28a52d' : '#05050d'

  return (
    <View
      style={{
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: '5%',
        marginBottom: '1%'
      }}
    >
      <View style={{ display: 'flex', flex: 0.8, flexDirection: 'column', justifyContent: 'flex-start' }}>
        {renderCards(props.values)}
        {props.values.length > 0 ? (
          <Text style={{ marginLeft: '20%', marginTop: '1%', color, opacity: props.did === props.issuer ? 0.4 : 1}}>
            <Icon size={15} name="check-all" />
            {props.did !== props.issuer ? ` ${props.issuer.substring(0, 25)}...` : ' Self-Signed'}
          </Text>
        ) : null}
      </View>
      {props.rightIcon ? props.rightIcon : null}
    </View>
  )
}

interface HeaderSectionProps {
  leftIcon: ReactNode
  title: string
}

export const HeaderSection: React.SFC<HeaderSectionProps> = props => {
  const styles = {
    defaultContainerStyle: {
      flexDirection: 'row',
      flexBasis: 'auto',
      paddingTop: '3%',
      justifyContent: 'space-between',
      backgroundColor: JolocomTheme.primaryColorWhite
    } as ViewStyle,
    defaultTitleStyle: {
      alignSelf: 'flex-start',
      ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
      color: '#05050d',
      fontFamily: JolocomTheme.contentFontFamily
    } as ViewStyle,
    defaultClaimSectionStyle: {
      flex: 0.8,
      justifyContent: 'space-between',
      flexGrow: 1
    } as ViewStyle,
    defaultLeftIconStyle: {
      alignItems: 'center',
      flex: 0.2
    } as ViewStyle
  }

  return (
    <View style={styles.defaultContainerStyle}>
      <View style={styles.defaultLeftIconStyle}>{props.leftIcon}</View>
      <View style={styles.defaultClaimSectionStyle}>
        <Text style={styles.defaultTitleStyle}>{props.title}</Text>
      </View>
    </View>
  )
}
