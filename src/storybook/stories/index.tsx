import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from 'src/styles'
import { IssuerCard } from 'src/ui/documents/components/issuerCard'
import { IdentitySummary } from 'src/actions/sso/types'

const style = StyleSheet.create({
  test: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.backUpWarningBg,
  },
})

const noPublicProfileSummary: IdentitySummary = {
  did: 'no-public-profile-summary',
}

const publicProfileSumary: IdentitySummary = {
  did: 'public-profile-summary',
  publicProfile: {
    name: 'This is my name!',
    description: 'This is a description!',
  },
}

storiesOf('IssuerCard', module)
  .add('with no public profile', () => IssuerCard(noPublicProfileSummary))
  .add('with a public profile', () => IssuerCard(publicProfileSumary))
