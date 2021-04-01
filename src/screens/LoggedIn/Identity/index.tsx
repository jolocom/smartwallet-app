import React, { useState } from 'react'

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
import { IdentityTabIds } from './types'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)
  const [initialTab, setInitialTab] = useState(IdentityTabIds.credentials)

  const handleIntroSubmit = (id: IdentityTabIds) => {
    setInitialTab(id)
  }

  return showIdentityIntro ? (
    <ScreenContainer
      isFullscreen
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <IdentityIntro onSubmit={handleIntroSubmit} />
    </ScreenContainer>
  ) : (
    <ScreenContainer>
      <ScreenContainer.Header>{strings.YOUR_INFO}</ScreenContainer.Header>
      <IdentityTabs initialTab={initialTab}>
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
