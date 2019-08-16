import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { Colors, Spacing } from 'src/styles'
import { ClaimCard } from 'src/ui/sso/components/claimCard'
import { getCredentialIconByType } from 'src/resources/util'
import { Container } from 'src/ui/structure'

storiesOf('ClaimCard', module)
  .add('with just primary text', () => (
    <Container style={{ backgroundColor: Colors.backgroundLightMain }}>
      <ClaimCard primaryText="Just primary text" />
      <ClaimCard primaryText="primaryText" secondaryText="secondaryText" />
    </Container>
  ))
  .add('with primary and secondary text and container style', () => (
    <ClaimCard
      primaryText="primaryText"
      secondaryText="secondaryText"
      containerStyle={{ backgroundColor: Colors.backUpWarningBg }}
    />
  ))
  .add(
    'with primary and secondary text and container style and left icon',
    () => (
      <ClaimCard
        primaryText="primaryText"
        secondaryText="secondaryText"
        leftIcon={getCredentialIconByType('Email')}
        containerStyle={{
          padding: Spacing.SM,
          borderWidth: 1,
          borderColor: 'green',
        }}
      />
    ),
  )
