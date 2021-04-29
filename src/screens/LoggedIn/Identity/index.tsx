import React, { useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'
import IdentityTabs from './tabs'
import { IdentityTabCredentialsIcon } from '~/assets/svg'
import { strings } from '~/translations'
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
      testID="home-identity-intro"
      isFullscreen
      customStyles={{ justifyContent: 'flex-start', paddingHorizontal: 0 }}
    >
      <IdentityIntro onSubmit={handleIntroSubmit} />
    </ScreenContainer>
  ) : (
    <ScreenContainer
      testID="home-self-issued-credentials"
      customStyles={{ paddingHorizontal: 0 }}
    >
      <ScreenContainer.Header customStyles={{ paddingLeft: '5%' }}>
        {strings.YOUR_INFO}
      </ScreenContainer.Header>
      <IdentityTabs initialTab={initialTab}>
        <IdentityTabs.Styled.Header>
          <IdentityTabs.Tab
            id={IdentityTabIds.credentials}
            title={strings.CREDENTIALS}
          >
            <IdentityTabCredentialsIcon />
          </IdentityTabs.Tab>
        </IdentityTabs.Styled.Header>
        <IdentityTabs.Page id={IdentityTabIds.credentials}>
          <IdentityCredentials />
        </IdentityTabs.Page>
      </IdentityTabs>
    </ScreenContainer>
  )
}

export default Identity
