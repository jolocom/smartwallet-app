import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { IssuerCard } from 'src/ui/documents/components/issuerCard'
import { IdentitySummary } from 'src/actions/sso/types'
import { Container } from 'src/ui/structure'

const noPublicProfileSummary: IdentitySummary = {
  did: 'no-public-profile-summary',
}

const publicProfileSummary: IdentitySummary = {
  did: 'public-profile-summary',
  publicProfile: {
    name:
      'This is my name which happens to be really long and tries to overflow!',
    description: 'This is a description!',
  },
}

const completePublicProfileSummary: IdentitySummary = {
  did: 'public-profile-with-image',
  publicProfile: {
    name: 'public-profile-with-image',
    description: 'where does this description go?',
    image: 'https://miro.medium.com/fit/c/256/256/1*jbb5WdcAvaY1uVdCjX1XVg.png',
    url: 'https://jolocom.io',
  },
}

storiesOf('IssuerCard', module)
  .add('with no public profile', () => (
    <Container>
      <IssuerCard issuer={noPublicProfileSummary} />
    </Container>
  ))
  .add('with a public profile', () => (
    <Container>
      <IssuerCard issuer={publicProfileSummary} />
    </Container>
  ))
  .add('complete public profile', () => (
    <Container>
      <IssuerCard issuer={completePublicProfileSummary} />
    </Container>
  ))
