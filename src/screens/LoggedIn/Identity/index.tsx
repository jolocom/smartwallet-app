import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'
import IdentityTabs from './tabs'
import {
  IdentityTabCredentialsIcon,
  IdentityTabBusinessCardIcon,
} from '~/assets/svg'
import { strings } from '~/translations'
import IdentityBusinessCard from './IdentityBusinessCard'

enum IdentityTabIds {
  credentials = 'credentials',
  businessCard = 'businessCard',
}

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)

  if (showIdentityIntro) {
    return (
      <ScreenContainer
        testID="home-identity-intro"
        isFullscreen
        customStyles={{ justifyContent: 'flex-start' }}
      >
        <IdentityIntro />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer
      testID="home-self-issued-credentials"
      customStyles={{ paddingHorizontal: 0 }}
    >
      <ScreenContainer.Header customStyles={{ paddingLeft: '5%' }}>
        {strings.YOUR_INFO}
      </ScreenContainer.Header>
      <IdentityTabs initialTab={IdentityTabIds.credentials}>
        <IdentityTabs.Styled.Header>
          <IdentityTabs.Tab
            id={IdentityTabIds.credentials}
            title={strings.CREDENTIALS}
          >
            <IdentityTabCredentialsIcon />
          </IdentityTabs.Tab>
          <IdentityTabs.Tab
            id={IdentityTabIds.businessCard}
            title={strings.BUSINESS_CARD}
          >
            <IdentityTabBusinessCardIcon />
          </IdentityTabs.Tab>
        </IdentityTabs.Styled.Header>
        <IdentityTabs.Page id={IdentityTabIds.credentials}>
          <IdentityCredentials />
        </IdentityTabs.Page>
        <IdentityTabs.Page id={IdentityTabIds.businessCard}>
          <IdentityBusinessCard />
        </IdentityTabs.Page>
      </IdentityTabs>
    </ScreenContainer>
  )
}

export default Identity
