import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ClaimCard } from '../../sso/components/claimCard'
import { IdentitySummary } from '../../../actions/sso/types'
import { isEmpty } from 'ramda'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: 18,
    paddingLeft: 15,
    paddingRight: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  icon: {
    width: 42,
    height: 42,
  },
  textContainer: {
    marginLeft: 16,
  },
  issuerName: JolocomTheme.textStyles.light.textDisplayField,
  urlText: {
    fontSize: 17,
    color: JolocomTheme.primaryColorPurple,
    fontFamily: JolocomTheme.contentFontFamily,
  },
})

export const IssuerCard = (issuer: IdentitySummary): JSX.Element => {
  const { image, primaryText, secondaryText } = convertToClaimCard(issuer)
  return (
    <ClaimCard
      containerStyle={{
        paddingVertical: '2%',
      }}
      secondaryText={secondaryText}
      secondaryTextStyle={styles.issuerName}
      primaryText={primaryText}
      primaryTextStyle={styles.urlText}
      leftIcon={<Image source={{ uri: image }} style={styles.icon} />}
    />
  )
}

const convertToClaimCard = ({ did, publicProfile }: IdentitySummary) => {
  if (!publicProfile || isEmpty(publicProfile)) {
    return {
      description: 'No description provided',
      image: undefined,
      primaryText: (did && did.substr(0, 25) + '...') || 'TODO',
      secondaryText: 'Service Name',
    }
  } else {
    return {
      primaryText: publicProfile.url,
      secondaryText: publicProfile.name,
      image: publicProfile.image,
      description: publicProfile.description,
    }
  }
}
