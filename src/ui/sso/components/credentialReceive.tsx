import { Colors } from '../../../styles'
import { Animated, Image, StyleSheet, Text, View } from 'react-native'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { centeredText, fontMain, fontMedium } from '../../../styles/typography'
import React, { useState } from 'react'
import { black065, greyLight, overflowBlack } from '../../../styles/colors'
import { IssuerPublicProfileSummary } from '../../../actions/sso/types'
import { DocumentReceiveCard } from './documentReceiveCard'
import { SignedCredentialWithMetadata } from '../../../lib/interactionManager/types'
import { OfferWithValidity } from 'src/lib/interactionManager/credentialOfferFlow'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreyLighter,
  },
  topSection: {
    alignItems: 'center',
  },
  logo: {
    borderRadius: 35,
    width: 70,
    height: 70,
    margin: 10,
    backgroundColor: greyLight,
  },
  serviceWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
  },
  serviceName: {
    fontFamily: fontMedium,
    fontSize: 28,
    color: overflowBlack,
    ...centeredText,
  },
  descriptionWrapper: {
    paddingBottom: 20,
  },
  description: {
    fontFamily: fontMain,
    fontSize: 16,
    color: black065,
    marginTop: 30,
    marginBottom: 4,
    marginHorizontal: '10%',
    ...centeredText,
  },
  scrollWrapper: {
    paddingBottom: '50%',
    paddingTop: '5%',
  },
})

interface Props {
  publicProfile: IssuerPublicProfileSummary
  credentialOfferSummary: OfferWithValidity[]
  onToggleSelect: (offering: SignedCredentialWithMetadata) => void
  isDocumentSelected: (offering: SignedCredentialWithMetadata) => boolean
}

export const CredentialReceiveComponent = (props: Props) => {
  const {
    publicProfile,
    credentialOfferSummary,
    onToggleSelect,
    isDocumentSelected,
  } = props

  const issuerImage = publicProfile?.image && publicProfile.image
  // TODO @clauxx add strings!
  const issuerName = publicProfile
    ? publicProfile.name
    : I18n.t(strings.UNKNOWN)

  const [transY] = useState(new Animated.Value(0))
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: transY } },
      },
    ],
    { useNativeDriver: false },
  )

  const opacity = transY.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0],
  })

  const textScale = transY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolateRight: 'clamp',
  })

  const iconScale = transY.interpolate({
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    inputRange: [30, 100],
    outputRange: [1, 0.7],
  })

  const iconTrans = transY.interpolate({
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    inputRange: [30, 100],
    outputRange: [0, -200],
  })

  const textTrans = transY.interpolate({
    inputRange: [30, 100],
    outputRange: [100, 20],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const marginValue = transY.interpolate({
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    inputRange: [30, 100],
    outputRange: [0, -10],
  })

  const iconAnimations = {
    marginVertical: marginValue,
    transform: [
      { scaleX: iconScale },
      { scaleY: iconScale },
      { translateX: iconTrans },
    ],
  }

  const serviceAnimations = {
    transform: [{ translateY: textTrans }],
  }

  const descriptionAnimations = {
    opacity,
    transform: [{ scaleX: textScale }, { scaleY: textScale }],
  }

  return (
    <>
      <Animated.View style={[styles.topSection, iconAnimations]}>
        {issuerImage ? (
          <Image style={styles.logo} source={{ uri: issuerImage }} />
        ) : (
          <View style={styles.logo} />
        )}
      </Animated.View>
      <Animated.View style={[styles.serviceWrapper, serviceAnimations]}>
        <Text style={styles.serviceName}>{issuerName}</Text>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollWrapper}
        scrollEventThrottle={1}
        onScroll={handleScroll}
      >
        <Animated.View
          style={[styles.descriptionWrapper, descriptionAnimations]}
        >
          <Text style={styles.description}>
            {I18n.t(
              strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_PROVIDED_BY_THIS_SERVICE_AND_WE_WILL_GENERATE_THEM_FOR_YOU,
            )}
          </Text>
        </Animated.View>
        {credentialOfferSummary.map((offer, i) => {
          const { validationErrors } = offer
          return (
            <DocumentReceiveCard
              key={i}
              onToggle={() =>
                !validationErrors.invalidIssuer &&
                !validationErrors.invalidSubject &&
                onToggleSelect(offer)
              }
              selected={isDocumentSelected(offer)}
              offering={offer}
              invalid={
                validationErrors.invalidIssuer ||
                validationErrors.invalidSubject
              }
            />
          )
        })}
      </Animated.ScrollView>
    </>
  )
}
