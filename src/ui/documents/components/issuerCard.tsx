import React from 'react'
import { StyleSheet, Image, View, Text, ViewStyle } from 'react-native'
import { IdentitySummary } from '../../../actions/sso/types'
import { Colors, Spacing, Typography } from 'src/styles'
import { CardWrapper } from 'src/ui/structure'
import isEmpty from 'ramda/es/isEmpty'

interface Props {
  issuer: IdentitySummary
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
  },
  issuerTextContainer: {
    // needed so the text overflow turns into ellipsis
    flex: 1,
    marginLeft: Spacing.MD,
  },
  nameText: {
    ...Typography.cardMainText,
  },
  urlText: {
    ...Typography.cardSecondaryText,
    color: Colors.purpleMain,
  },
})

export const IssuerCard: React.FC<Props> = props => {
  const {
    issuer,
    style: propsStyle,
    issuer: { publicProfile },
  } = props
  // set up defaults
  let name = 'Service Name',
    // Description was included before, but we aren't using it
    // description = 'No description provided',
    image = undefined,
    url = issuer.did as string | undefined

  if (publicProfile && !isEmpty(publicProfile)) {
    name = publicProfile.name
    // description = publicProfile.description
    image = publicProfile.image
    url = publicProfile.url
  }

  return (
    <CardWrapper style={[styles.container, propsStyle]}>
      {image && <Image source={{ uri: image }} style={styles.icon} />}
      <View style={styles.issuerTextContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.urlText} numberOfLines={1}>
          {url}
        </Text>
      </View>
    </CardWrapper>
  )
}
