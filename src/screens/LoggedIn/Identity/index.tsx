import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'
import IdentityTabs from './tabs'
import { View } from 'react-native'
import {
  IdentityTabCredentialsIcon,
  IdentityTabBusinessCardIcon,
} from '~/assets/svg'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)

  // TODO: could we use a modal for the @IdentityIntro (@TopSheet)? Otherwise we
  // lose the functionality of the @ScreenContainer and it's styles.
  return (
    <ScreenContainer isFullscreen>
      {showIdentityIntro ? (
        <IdentityIntro />
      ) : (
        <View
          style={{
            paddingHorizontal: '5%',
            paddingTop: 20,
            width: '100%',
            flex: 1,
          }}
        >
          <IdentityTabs initialTab="credentials">
            <IdentityTabs.Header>
              <IdentityTabs.Tab id="credentials" title="Credentials">
                <IdentityTabCredentialsIcon />
              </IdentityTabs.Tab>
              <IdentityTabs.Tab title="Business Card" id="business-card">
                <IdentityTabBusinessCardIcon />
              </IdentityTabs.Tab>
            </IdentityTabs.Header>
            <IdentityTabs.Content>
              <IdentityTabs.Page id="credentials">
                <IdentityCredentials />
              </IdentityTabs.Page>
              <IdentityTabs.Page id="business-card">
                {/* Business Card components */}
              </IdentityTabs.Page>
            </IdentityTabs.Content>
          </IdentityTabs>
        </View>
      )}
    </ScreenContainer>
  )
}

export default Identity
